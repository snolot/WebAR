class Webcam {
	
	async setupCamera(htmlVideoElementID) {
		/*alert(navigator.mediaDevices.getUserMedia)
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
		    throw new Error('Browser API navigator.mediaDevices.getUserMedia not available');
		}*/

		const video = document.getElementById(htmlVideoElementID);

		const constraints = { 
			audio: false, 
			video: {
                width: 1920,
                height: 1080,
                facingMode: {
                    ideal: 'back',
                }
            }
        }

		const stream = await navigator.mediaDevices.getUserMedia(constraints);

		video.srcObject = stream; 

		return new Promise((resolve) => {
		    video.onloadedmetadata = () => {
		      	resolve(video);
		    };
		});
	}

	async getCamera(htmlVideoElementID){
		const video = await this.setupCamera(htmlVideoElementID);
		video.play();

		return video;
	}
}