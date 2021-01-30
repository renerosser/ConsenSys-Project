# ConsenSys-Project
ConsenSys Final Project for Rene Rosser

## 1. Restricting Access
I have a number of checks in place in functions to ensure that there are no anonymous users adding or tipping images. This check was done using require() statements, where the requirements are that the sender's address must be valid in order to action the item.

## 2. Circuit Breaker
I have implemented a circuit breaker for the upload of images in case something goes wrong in the upload process.

## 3. Speed Bump
I have implemented a speed bump in order to prevent users from exploiting the tipping functionality. I also have loading screens in place to minimise the amount of times users can press the TIP button in one go.
