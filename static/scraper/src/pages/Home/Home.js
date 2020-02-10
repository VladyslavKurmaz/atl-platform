import React from 'react';

import './Home.css';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker } from 'react-leaflet';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import SankeyChart from "./../../components/SankeyChart/SankeyChart";
import PieChart from "./../../components/PieChart/PieChart";

import 'react-leaflet-markercluster/dist/styles.min.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

import reportData from './../../data/report.json';

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
      width: 0,
      height: 0
    }
  }

  render() {
    const position = [this.state.lat, this.state.lng];
    const report = reportData;
    return (
        <div className="container pt-4">
          <div className="row">
            <div className="col-2 text-left pb-4">
              <Link to={'/'} className="text-decoration-none">
                <div className=""><ArrowBackIosIcon fontSize="small"/></div>
              </Link>
            </div>
            <div className="col">
              <p className="h6">{report.title}</p>
              {/*<button onClick={ (e) => {
                html2canvas(document.body).then(function(canvas) {
                  document.body.appendChild(canvas);
                })}}>Capture
              </button>*/}
            </div>
            <div className="col-2 text-right pb-4">
              <Link to={'/'} className="text-decoration-none">
                <div className=""><ArrowForwardIosIcon fontSize="small"/></div>
              </Link>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <div className="container-fluid">
                <div className="row">
                  {report.graphs.map((r, i) => 
                    <div key={i.toString()} className="col-sm-12 col-md-6 p-4 border">
                      <p className="h6 pb-2">{r.title}<span className="badge badge-secondary float-right">{report.title}</span></p>
                      {r.type === 'map' &&
                        <Map center={position} zoom={this.state.zoom} maxZoom={7} style={{height:'448px'}}>
                          <TileLayer
                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
                          <MarkerClusterGroup maxClusterRadius={10}>
                            {r.data.map((p, pi) => 
                              <Marker key={pi.toString()} position={p} />
                            )}
                          </MarkerClusterGroup>
                        </Map>
                      }
                      {r.type === 'sankey' && 
                        <SankeyChart height={'448px'} data={r.data}/>
                      }
                      {r.type === 'pie' && 
                        <PieChart height={'448px'} data={r.data}/>
                      }
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
    );
  }
}


