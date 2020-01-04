import React from 'react';
import ReactDOM from "react-dom";
import cities from 'cities.json';
import stringSimilarity from 'string-similarity';

import './Home.css';
import { Link } from 'react-router-dom';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';

import SankeyChart from "./../../components/SankeyChart/SankeyChart";

import 'react-leaflet-markercluster/dist/styles.min.css';
import MarkerClusterGroup from 'react-leaflet-markercluster';

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
    const byLocations = [
      { key: 'Khmelnytskyi', tags: 5 },
      { key: 'Zhytomyr', tags: 4 },
      { key: 'Chernivtsi', tags: 3 },
      { key: 'Ivano-Frankivsk', tags: 3 },
      { key: 'Rivne', tags: 2 },
      { key: 'Sumy', tags: 2 },
      { key: 'Lutsk', tags: 2 },
      { key: 'Poltava', tags: 2 },
      { key: 'Prague', tags: 1 },
      { key: 'Chernihiv', tags: 1 },
      { key: 'Sydney', tags: 1 },
      { key: 'Ternopil', tags: 1 },
      { key: 'Stockholm', tags: 1 },
      { key: 'Kherson', tags: 1 },
      { key: 'St. Petersburg', tags: 1 },
      { key: 'Vancouver', tags: 1 },
      { key: 'Mariupol', tags: 1 },
      { key: 'San Francisco', tags: 1 },
      { key: 'Palo Alto', tags: 1 },
      { key: 'Poznań', tags: 1 },
      { key: 'Bratislava', tags: 1 },
      { key: 'Brovary', tags: 1 },
      { key: 'Cherkasy', tags: 1 }
    ];
    const names = cities.map(e => e.name);
    let positions = []
    byLocations.forEach( l => {
      let found = false;
      for( let c = 0; c < cities.length; c++ ) {
        if (l.key === cities[c].name) {
//          console.log(l.key, cities[c].lat, cities[c].lng);
          if (l.tags > 1) {
            for(let cnt = 0; cnt < l.tags; cnt++) {
              positions.push([cities[c].lat, cities[c].lng]);
            }
          }
          found = true;
          break;
        }
      }
      if (!found) {
//        console.log(l.key, 'not found');
//        const bestMatch = stringSimilarity.findBestMatch(l.key, names);
//        console.log(bestMatch.bestMatch);
      }
    });
//    console.log(stringSimilarity.compareTwoStrings('Uzhhorod', 'Uzhgorod'));
//    console.log(stringSimilarity.compareTwoStrings('Kramatorsk', 'Kramators�k'));
//    console.log(stringSimilarity.compareTwoStrings('Krakow', 'Kraków'));
//    console.log(positions);






    const report = {
      date: '2019-12-29',
      graphs: [
        {
          type: 'map',
          title: 'Number of vacancies per city',
          data: positions
        },
        {
          type: 'sankey',
          title: 'Number of vacancies per cities per companies',
          data: [
            ['From', 'To', 'Weight'],
            ['Kyiv', 'Epam', 10],
            ['Kyiv', 'Ciklum', 7],
            ['Lviv', 'Epam', 2],
            ['Lviv', 'Ciklum', 9],
            ['Lviv', 'GlobalLogic', 2],
            ['Lviv', 'Luxoft', 2]
          ]
        },
        {
          type: 'sankey',
          title: 'Demand for technologies by companies',
          data: [
            ['From', 'To', 'Weight'],
            ['C++', 'Epam', 10],
            ['C++', 'Ciklum', 7],
            ['C++', 'GlobalLogic', 6],
            ['C++', 'Luxoft', 2],
            ['Java', 'Epam', 2],
            ['Java', 'Ciklum', 9],
            ['Java', 'GlobalLogic', 2],
            ['Java', 'Luxoft', 2]
          ]
        },
        {
          type: 'sankey',
          title: 'Demand for seniority by companies',
          data: [
            ['From', 'To', 'Weight'],
            ['Intern', 'Epam', 10],
            ['Intern', 'Ciklum', 7],
            ['Junior', 'GlobalLogic', 6],
            ['Middle', 'Luxoft', 2],
            ['Senior', 'Epam', 2],
            ['Lead', 'Ciklum', 9],
            ['Architect', 'GlobalLogic', 2]
          ]
        },
        {
          type: 'sankey',
          title: 'Demand for specialization by companies',
          data: [
            ['From', 'To', 'Weight'],
            ['Developer', 'Epam', 10],
            ['Developer', 'Ciklum', 7],
            ['QA', 'GlobalLogic', 6],
            ['QA', 'Luxoft', 2],
            ['DevOps', 'Epam', 2],
            ['Project Manager', 'Ciklum', 9],
            ['Java', 'GlobalLogic', 2],
            ['Java', 'Luxoft', 2]
          ]
        },
        {
          type: 'sankey',
          title: 'Technologies distribution by location',
          data: [
            ['From', 'To', 'Weight'],
            ['C++', 'Kyiv', 10],
            ['Java', 'Lviv', 7],
            ['C++', 'Dnepr', 6],
            ['JavaScript', 'Dnepr', 2],
            ['AngularJS', 'Kyiv', 2],
            ['React', 'Kharkiv', 9],
            ['RoR', 'Odessa', 2],
            ['C#', 'Odessa', 2]
          ]
        },
        {
          type: 'sankey',
          title: 'Seniority distribution by location',
          data: [
            ['From', 'To', 'Weight'],
            ['Intern', 'Kyiv', 10],
            ['Junior', 'Lviv', 7],
            ['Middle', 'Dnepr', 6],
            ['Senior', 'Dnepr', 2],
            ['Lead', 'Kyiv', 2],
            ['Architect', 'Kharkiv', 9],
            ['Architect', 'Kyiv', 9],
            ['Architect', 'Odessa', 9],
            ['Intern', 'Odessa', 2],
            ['Junior', 'Odessa', 2]
          ]
        },
        {
          type: 'sankey',
          title: 'Specialization distribution by location',
          data: [
            ['From', 'To', 'Weight'],
            ['Developer', 'Kyiv', 10],
            ['Developer', 'Kharkiv', 7],
            ['QA', 'Lviv', 6],
            ['QA', 'Dnepr', 2],
            ['DevOps', 'Odessa', 2],
            ['Project Manager', 'Kyiv', 9],
            ['Java', 'Kharkiv', 2],
            ['Java', 'Lviv', 2]
          ]
        }
      ]
    }

    return (

        <div className="container pt-4">
          <div className="row">
            <div className="col-2 text-left pb-4">
              <Link to={'/'} className="text-decoration-none">
                <div className=""><ArrowBackIosIcon fontSize="small"/></div>
              </Link>
            </div>
            <div className="col">
              <p className="h6">2019-12-29</p>
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
                    <div key={i.toString()} className="col-sm-12 col-md-6 p-4 border1">
                      <p className="h6 pb-2">{r.title}<span className="badge badge-secondary float-right">{report.date}</span></p>
                      {r.type === 'map' &&
                        <Map center={position} zoom={this.state.zoom} maxZoom={7} style={{height:'384px'}}>
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
                        <SankeyChart height={'384px'} data={r.data}/>
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


