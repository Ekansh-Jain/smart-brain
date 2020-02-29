import React,{Component} from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import Register from './components/Register/Register';
import './App.css';
import SignIn from './components/SignIn/SignIn';
import Particles from 'react-particles-js';


const initialState={
  input: '',
      imageUrl: '',
      box:[],
      route:'signin',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
}


const particlesOptions ={
                particles: {
                  number:{
                    value:30,
                    density:{
                      enable:true,
                      value_area:800
                    }
                  },
                  line_linked: {
                    shadow: {
                      enable: true,
                      color: "#3CA9D1",
                      blur: 5
                    }
                  }
                }
              }


class App extends Component{
  constructor(){
    super();
    this.state={
      input: '',
      imageUrl: '',
      box:[],
      route:'signin',
      isSignedIn: false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    }
  }

  loadUser =(data) =>{
    this.setState({user: {
        id:data.id,
        name:data.name,
        email:data.email,
        entries:data.entries,
        joined:data.joined
    }})
  }
  calculateFaceLocation = (data) =>{
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image =document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   return{
    leftCol:clarifaiFace.left_col * width,
    topRow: clarifaiFace.top_row * height,
    rightCol: width - (clarifaiFace.right_col *width),
    bottomRow : height- (clarifaiFace.bottom_row * height)
   }
  }

  

  displayFaceBox =(box)=>{
    this.setState({box : box});
  }
  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl:this.state.input});
    fetch('https://safe-temple-79807.herokuapp.com/imageurl',{
          method: 'post',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            "input":this.state.input
          })
        })
    .then(response=>response.json())
    .then(response =>{
      if(response){
        fetch('https://safe-temple-79807.herokuapp.com/image',{
          method: 'put',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({
            "id":this.state.user.id
          })
        })
        .then(response=> response.json())
        .then(count=>{
          this.setState(Object.assign(this.state.user,{entries:count}))
        })
        .catch(console.log)

      }
      this.displayFaceBox(this.calculateFaceLocation(response));
    })
    .catch(err=>console.log(err));
  }

  onRouteChange =(route)=>{
    
    if(route==='signout'){
      this.setState(initialState)
    }
    else if(route==='home'){
      this.setState({isSignedIn:true})
    }
    this.setState({route:route});
  }
  render(){
    return (
      <div className="App">
        <Particles className='particles'
                params={particlesOptions}/> 
        <Navigation isSignedIn={this.state.isSignedIn} onRouteChange = {this.onRouteChange} />
        { this.state.route=== 'home'
        ? <div>
            <Logo />
            <Rank name={this.state.user.name} entries={this.state.user.entries}/>
            <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
            <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl}/>
         </div> 
         :(
            this.state.route=== 'signin'
            ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>

          )}
      </div>
    );
  }
}

export default App;
