// import React from 'react';
// import logo from './logo.svg';
// import './App.css';
// import Canvas from './Canvas';
// import VrPlayer from 'react-vr-player';


// const Player = props => {
//     const sources = [ // Declare an array of video sources
//       { url: '/videos/video.webm', type: 'video/webm' },
//       { url: '/videos/video.mp4', type: 'video/mp4' }
//     ];
//     const keys = { // If you want to re-define the keys, here are the defaults
//       left: 'A',
//       right: 'D',
//       up: 'W',
//       down: 'S',
//       rotateLeft: 'Q',
//       rotateRight: 'E',
//       fullScreen: 'F',
//       zeroSensor: 'Z',
//       playPause: ' '
//     };
//     return (
//       <VrPlayer
//         sources={sources}
//         brand="Some Brand Name"
//         title="Some Video Title"
//         keys={keys} />

//     );
// }


// function App() {
//   return (
//     <div className="">
//       {/* <Canvas /> */}
//       <Player />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import Canvas from './Canvas';
import './App.css';


const App = () => {

    return (
        <div className="App">
            <Canvas />
        </div>
    )
}

export default App;