import React, { Component } from 'react';
import Web3 from 'web3';
import Identicon from 'identicon.js';
import './App.css';
import Decentragram from '../abis/Decentragram.json'
import Navbar from './Navbar'
import Main from './Main'

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

	async componentWillMount() {
		await this.loadWeb3()
		await this.loadBlockchainData()
	}

	// Load web3
	async loadWeb3() {
		if (window.ethereum) {
			window.web3 = new Web3(window.ethereum)
			await window.ethereum.enable()
		}
		else if (window.web3) {
			window.web3 = new Web3(window.web3.currentProvider)
		}
		else {
			window.alert("Non-Ethereum browser detected")
		}
	}

	// Load accounts
	async loadBlockchainData() {
		const web3 = window.web3

		// Load account
		const accounts = await web3.eth.getAccounts()
		this.setState({ account: accounts[0] })

		// Get network ID
		const networkId = await web3.eth.net.getId()

		// Get network data
		const networkData = Decentragram.networks[networkId]

		// Check if network data exists
		if (networkData) {

			// Fetch contract
			const decentragram = web3.eth.Contract(Decentragram.abi, networkData.address)
			this.setState({ decentragram })

			// Set the image count
			const imagesCount = await decentragram.methods.imageCount().call()
			this.setState({ imagesCount })

			// Load Images
			for (var i = 1; i <= imagesCount; i++) {
				const image = await decentragram.methods.images(i).call()			
				this.setState({
					images: [...this.state.images, image]
				})
			}

			// Sort Images by highest tipped


			// Loading done
			this.setState({ loading: 0 })
		}
		else {
			window.alert("Decentragram contract not deployed to network")
		}
	}

	captureFile = event => {
		event.preventDefault()
		const file = event.target.files[0]
		const reader = new window.FileReader()
		reader.readAsArrayBuffer(file)

		reader.onloadend = () => {
			this.setState({ buffer: Buffer(reader.result) })
			console.log('Buffer', this.state.buffer)
		}
	}

	uploadImage = description => {
		console.log("Uploading to IPFS")

		// Add file to IPFS
		ipfs.add(this.state.buffer, (error, result) => {
			console.log("IPFS Result", result)
			
			if (error) {
				console.log(error)
				return
			}

			this.setState({ loading: true })

			// Upload image using Decentragram contract
			this.state.decentragram.methods.uploadImage(result[0].hash, description)
				.send({ from: this.state.account })
				.on('transactionHash', (hash) => {
					this.setState({ loading: false })
				})
		})
	}

	tipImageOwner(id, tipAmount) {
		this.setState({ loading: true })
		this.state.decentragram.methods.tipImageOwner(id)
			.send({ from: this.state.account, value: tipAmount })
			.on('transactionHash', (hash) => {
		  		this.setState({ loading: false })
			})
	}

  	constructor(props) {
    	super(props)
    	this.state = {
			account: '',
			decentragram: null,
			images: [],
			imagesCount: 0,
			loading: true
		}
		
		this.uploadImage = this.uploadImage.bind(this)
		this.tipImageOwner = this.tipImageOwner.bind(this)
		this.captureFile = this.captureFile.bind(this)
	}
	
	render() {
		return (
			<div>
				<Navbar account={this.state.account} />
				{ this.state.loading
					? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
					: <Main
						images={ this.state.images }
						captureFile={ this.captureFile }
						uploadImage={ this.uploadImage }
              			tipImageOwner={this.tipImageOwner}
					/>
				}
			</div>
		);
	}
}

export default App;