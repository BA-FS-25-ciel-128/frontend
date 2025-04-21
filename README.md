# TalkyWalky Chat Application Frontend

## Description

This project is part of our (Ilimea Gall and Jasmin Zuzo) Bachelor's thesis at [ZHAW](https://www.zhaw.ch/en/university) and shows a 3D-Avatar, called TalkyWalky, embedded in a chat environment. TalkyWalky takes on the role of an English teacher for children, responding with animations and expressions that match the current conversation. 

The goal of our thesis is to evaluate how effectively such an avatar can use OpenAI to deliver real-time responses with matching animations and to assess the effort required to achieve this. To do so, we defined reactions based on user expectations and extended the avatar with gestures, facial expressions, and other animations that can be triggered based on the content of each response. These enhancements aim to make the avatar more engaging and natural for the target audience, while ensuring that the animations feel fitting and not exaggerated.

This is the frontend of the application, the backend can be found [here](https://github.com/BA-FS-25-ciel-128/backend)

Additionally, the blend file of the avatar TalkyWalky can be found [here](https://github.com/BA-FS-25-ciel-128/TalkyWalkyAvatar).


## Functionality

TODO here: add picture

Simply write a short message in the input box to start chatting with TalkyWalky. The message is sent to the backend for processing. Once a response is received, the frontend animates the avatar accordingly, including lip sync, facial expressions and matching body movements.

## Background

The structure of this project is based on the [r3f-virtual-girlfriend-frontend](https://github.com/wass08/r3f-virtual-girlfriend-frontend) template created by [Wassim Samad](https://github.com/wass08). 
More details can be found in the corresponding [youtube video](https://www.youtube.com/watch?v=EzzcEL_1o9o).

The project uses Three.js together with React to render the 3D avatar and manage the interactive frontend.

## Getting Started

**Start the application locally**

- Clone this repository
- Clone the backend repository and follow the instructions there
- Run `npm install` in the project folder
- Run `npm run dev` in the project folder

**Start the application with Docker**

- Clone this repository
- Clone the backend repository and follow the instructions there
- Run `docker compose up` in the project folder