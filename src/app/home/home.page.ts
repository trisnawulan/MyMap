import { Component, OnInit } from '@angular/core';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  mapView: MapView | any;
  userLocationGraphic : Graphic | any;
  selectedBasemap: string = "topo-vector";

  constructor () {}

  async ngOnInit() {
    await this.initializeMap();
    this.addWeatherPointMarkers();  // Menambahkan semua marker setelah peta diinisialisasi
  }


  async initializeMap() {
    const map = new Map({
      basemap: this.selectedBasemap
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 6, // Zoom level adjusted for better view of Kansas
      center: [-97.5, 39.0] // Center map over Kansas
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceURL });
    map.add(weatherServiceFL);

    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
  }

  async changeBasemap() {
    if (this.mapView) {
      this.mapView.map.basemap = this.selectedBasemap;
    }
  }

  addWeatherPointMarkers() {
    const locations = [
      { longitude: -94.10610906794427,  latitude: 38.993325156826316  },  // Kansas
      { longitude: -81.9115348156794, latitude: 36.2531368188833 },  // Los Angeles, California
      { longitude: -74.0060, latitude: 40.7128 },  // New York City, New York
      { longitude: -87.6298, latitude: 41.8781 },  // Chicago, Illinois
      { longitude: -95.3698, latitude: 29.7604 },  // Houston, Texas
      { longitude: -122.4194, latitude: 37.7749 }  // San Francisco, California
    ];

    locations.forEach(location => {
      // Create a point for each location
      let point = new Point({
        longitude: location.longitude,
        latitude: location.latitude
      });

      // Create a symbol for the point
      let markerSymbol = new SimpleMarkerSymbol({
        color: [255, 0, 0], // Red color
        size: '12px', // Size of the marker
        outline: {
          color: [255, 255, 255], // White outline
          width: 2
        }
      });

      // Create a graphic for each point and add it to the mapView
      let pointGraphic = new Graphic({
        geometry: point,
        symbol: markerSymbol
      });

      this.mapView.graphics.add(pointGraphic);
    });
  }

  async getLocationService(): Promise<number[]> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition((resp) => {
        resolve([resp.coords.latitude, resp.coords.longitude]);
      });
    });
  }

  async updateUserLocationOnMap() {
    let latLng = await this.getLocationService();
    let geom = new Point({ latitude: latLng[0], longitude: latLng[1] });
    if (this.userLocationGraphic) {
      this.userLocationGraphic.geometry = geom;
    } else {
      this.userLocationGraphic = new Graphic({
          symbol: new SimpleMarkerSymbol(),
          geometry: geom,
      });
      this.mapView.graphics.add(this.userLocationGraphic);
    }
  }
}

const WeatherServiceURL = "https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer";
