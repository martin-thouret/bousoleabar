import React, { Component } from 'react';
import axios from 'axios';
import { colors } from '@mui/material';

class Compass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userLocation: null,
      nearestBarLocation: null,
      arrowRotation: 0, // Ajout de l'angle de rotation de la flèche
    };
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(position => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      this.setState({ userLocation });

      this.fetchNearestBar(userLocation);
    });
  }

  fetchNearestBar(userLocation) {
    axios.get(`${window.location.origin}/api/getNearestBar?lat=${userLocation.lat}&lng=${userLocation.lng}`)
      .then(response => {
        if (response.data.results.length > 0) {
          const nearestBarLocation = response.data.results[0].geometry.location;
          this.setState({ nearestBarLocation });

          // Calculez l'angle de rotation de la flèche
          const arrowRotation = this.calculateArrowRotation(userLocation, nearestBarLocation);
          this.setState({ arrowRotation });
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }

  calculateArrowRotation(userLocation, nearestBarLocation) {
    const deltaX = nearestBarLocation.lng - userLocation.lng;
    const deltaY = nearestBarLocation.lat - userLocation.lat;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    return angle;
  }

  render() {
    const { userLocation, nearestBarLocation, arrowRotation } = this.state;

    if (!userLocation || !nearestBarLocation) {
      return <div>Loading...</div>;
    }

    return (
      <div className="compass-container">
        

        {/* Affichez la flèche avec la rotation dynamique */}
        <style>
          {`
            .arrow {
              width: 0;
              height: 0;
              border-left: 15px solid transparent;
              border-right: 15px solid transparent;
              border-bottom: 30px solid red; /* Remplacez 'red' par la couleur que vous souhaitez */
              position: absolute;
              top: 50%;
              left: 50%;
              transform-origin: bottom center;
            }
          `}
        </style>
        <div className="arrow" style={{ transform: `translate(-50%, -50%) rotate(${arrowRotation}deg)`}}></div>
      </div>
    );
  }
}

export default Compass;

