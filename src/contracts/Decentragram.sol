pragma solidity ^0.5.0;

contract Decentragram {
    string public name = "Decentragram";

	// Store Images
	uint public imageCount = 0;
	mapping(uint => Image) public images;

	struct Image {
		uint id;
		string hash;
		string description;
		uint tipAmount;
		address payable author;
	}

	event ImageCreated(
		uint id,
		string hash,
		string description,
		uint tipAmount,
		address payable author
	);

	event ImageTipped(
		uint id,
		string hash,
		string description,
		uint tipAmount,
		address payable author
	);

	// Create Images
	function uploadImage(string memory _imgHash, string memory _description) public {

		// Make sure image hash exists
		require(bytes(_imgHash).length > 0);

		// Make sure description exists
		require(bytes(_description).length > 0);

		// Make sure uploader address is not blank
		require(msg.sender != address(0));
		
		// Increment post ID
		imageCount ++;

		// Add post to contract
		images[imageCount] = Image(imageCount, _imgHash, _description, 0, msg.sender);

		// Trigger an event
		emit ImageCreated(imageCount, _imgHash, _description, 0, msg.sender);
	}
	
	// Like/tip Images
	function tipImageOwner(uint _id) public payable {

		// Make sure the ID is valid
		require(_id > 0 && _id <= imageCount);

		// Fetch the image
		Image memory _image = images[_id];

		// Fetch the author
		address payable _author = _image.author;

		// Pay author in ether
		address(_author).transfer(msg.value);

		// Increment tip amount
		_image.tipAmount = _image.tipAmount + msg.value;

		// Update image
		images[_id] = _image;

		// Trigger an event
		emit ImageTipped(_id, _image.hash, _image.description, _image.tipAmount, _author);
	}
}