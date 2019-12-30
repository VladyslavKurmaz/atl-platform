import React from 'react';
import ReactDOM from "react-dom";
import * as d3 from "d3";

import './Home.css';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import D3Sankey from "./../../components/D3Sankey/D3Sankey";

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

type State = {
  lat: number,
  lng: number,
  zoom: number
}

export default class Home extends React.Component<{}, State> {
  constructor(props) {
    super(props);
    this.state = {
      lat: 48.383022,
      lng: 31.1828699,
      zoom: 5,
      data: {
        nodes:[
          {name:'Node0'},
          {name:'Node1'},
          {name:'Node2'},
          {name:'Node3'},
          {name:'Node4'}
        ],
        links:[
          {source:0,target:1,value:35},
          {source:0,target:2,value:12},
          {source:0,target:3,value:5},
          {source:1,target:4,value:5}
        ]
      },
      width: 0,
      height: 0
    }
    this.svgRef = React.createRef();
  }

  componentDidMount() {
    /*/
    d3.json("/ugr-sankey-openspending.json").then(data =>
      this.setState({ data })
    );
    /*/
    this.measureSVG();
    window.addEventListener("resize", this.measureSVG);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.measureSVG);
  }

  measureSVG = () => {
    const { width, height } = this.svgRef.current.getBoundingClientRect();
    console.log('!!!!!!!!!!!!!!!!!!!!', width, height);

    this.setState({
      width,
      height
    });
  };


  render() {
    const position = [this.state.lat, this.state.lng];
    const { data, width, height } = this.state;

    return (

        <div className="container pt-4">
          <div className="row">
            <div className="col-1">
              <Link to={'/'} className="text-decoration-none">
                <div className="pt-5"><ArrowBackIosIcon fontSize="small"/></div>
              </Link>
            </div>
            <div className="col">
              <div className="container-fluid">
                <div className="row">
                  <div className="col-sm-12 col-md-6 p-2">
                    <Map center={position} zoom={this.state.zoom} style={{height:'256px'}}>
                      <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />
                      <Marker position={position}>
                        <Popup>
                          A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                      </Marker>
                    </Map>
                  </div>
                  <div className="col-sm-12 col-md-6 p-2">
        <svg width="100%" height="256px" ref={this.svgRef}>
          {data && (
            <D3Sankey data={data} width={width} height={height} />
          )}
        </svg>
                  </div>
                  <div className="col-sm-12 col-md-6 bg-secondary">
c
                  </div>
                  <div className="col-sm-12 col-md-6 bg-secondary">
d
                  </div>
                </div>
              </div>
            </div>
            <div className="col-1">
              <Link to={'/'} className="text-decoration-none">
                <div className="pt-5"><ArrowForwardIosIcon fontSize="small"/></div>
              </Link>
            </div>
          </div>
        </div>

    );
  }
}


