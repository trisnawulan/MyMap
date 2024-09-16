import { Component, OnInit } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import Map from '@arcgis/core/Map';
import MapView from '@arcgis/core/views/MapView';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point'; // Impor Point


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  private latitude: number | any;
  private longitude: number | any;

  constructor() {}

  public async ngOnInit() {
    const position = await Geolocation.getCurrentPosition();
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;

    // Buat instance peta
    const map = new Map({
      basemap: "satellite"
    });

    const view = new MapView({
      container: "container",
      map: map,
      zoom: 16,
      center: [this.longitude, this.latitude] // Longitude, Latitude
    });

    // Gunakan class Point dari ArcGIS API
    const point = new Point({
      longitude: this.longitude,
      latitude: this.latitude
    });

    const markerSymbol = {
      type: "simple-marker",
      style: "circle", // Mengganti bentuk menjadi diamond (bisa juga 'circle', 'square', 'cross', dll.)
      color: [255, 0, 0], // Warna biru cerah
      size: "40px", // Ukuran marker
      outline: {
        color: [255, 255, 0], // Warna kuning pada garis tepi
        width: 3
      },
      shadow: {
        color: [50, 50, 50, 0.5], // Menambahkan bayangan dengan opasitas
        offsetX: 3,
        offsetY: 3,
        blurRadius: 5
      }
    };


    const pointGraphic = new Graphic({
      geometry: point,  // Menggunakan class Point sebagai geometri
      symbol: markerSymbol
    });

    // Tambahkan marker ke peta
    view.graphics.add(pointGraphic);
  }
}
