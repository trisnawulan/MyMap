import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; // Impor Point
import PictureMarkerSymbol from '@arcgis/core/symbols/PictureMarkerSymbol'; // Impor PictureMarkerSymbol
import SimpleMarkerSymbol from '@arcgis/core/symbols/SimpleMarkerSymbol';
import ImageryLayer from '@arcgis/core/layers/ImageryLayer'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  mapView: MapView | any;
  userLocationGraphic: Graphic | any;

  constructor () {}

  async ngOnInit() {
    const map = new Map({
      basemap: "topo-vector"
    });

    this.mapView = new MapView({
      container: "container",
      map: map,
      zoom: 8
    });

    let weatherServiceFL = new ImageryLayer({ url: WeatherServiceUrl });
    map.add(weatherServiceFL);

    await this.updateUserLocationOnMap();
    this.mapView.center = this.userLocationGraphic.geometry as Point;
    setInterval(this.updateUserLocationOnMap.bind(this), 10000);
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

const WeatherServiceUrl =
    'https://mapservices.weather.noaa.gov/eventdriven/rest/services/radar/radar_base_reflectivity_time/ImageServer/'



  // private latitude: number | any;
  // private longitude: number | any;

  // constructor() {}

//   public async ngOnInit() {
//     const position = await Geolocation.getCurrentPosition();
//     this.latitude = position.coords.latitude;
//     this.longitude = position.coords.longitude;

//     // Buat instance peta
//     const map = new Map({
//       basemap: "satellite"
//     });

//     const view = new MapView({
//       container: "container",
//       map: map,
//       zoom: 16,
//       center: [this.longitude, this.latitude] // Longitude, Latitude
//     });

//     // Gunakan class Point dari ArcGIS API
//     const point = new Point({
//       longitude: this.longitude,
//       latitude: this.latitude
//     });

//     const markerSymbol = {
//       type: "simple-marker",
//       style: "circle", // Mengganti bentuk menjadi diamond (bisa juga 'circle', 'square', 'cross', dll.)
//       color: [255, 0, 0], // Warna biru cerah
//       size: "40px", // Ukuran marker
//       outline: {
//         color: [255, 255, 0], // Warna kuning pada garis tepi
//         width: 3
//       },
//       shadow: {
//         color: [50, 50, 50, 0.5], // Menambahkan bayangan dengan opasitas
//         offsetX: 3,
//         offsetY: 3,
//         blurRadius: 5
//       }
//     };


//     const pointGraphic = new Graphic({
//       geometry: point,  // Menggunakan class Point sebagai geometri
//       symbol: markerSymbol
//     });

//     // Tambahkan marker ke peta
//     view.graphics.add(pointGraphic);
//   }

