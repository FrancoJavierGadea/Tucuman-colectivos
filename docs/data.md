# Data


## Endpoints

```txt
/data/{category}/{line}/{direction}/{data_type}
```

- `{category}` es `urbano` `interurbano` `rural`

- `{line}` es el **número del colectivo** o su **nombre**

   Ej: `103` `1` `3` `9` `el-provincial`

- `{direction}` es es recorrido

   Ej: `horario` `anti-horario` `lavalle`, `las-piedras` `viamonte`

- `{data_type}` es el tipo de datos que se quiere obtener
 
  Ej: `recorrido.geojson`, `paradas.geojson`, `metadata.json`


<br>

## Metadata JSON

```json
{
  "name": "Linea 19",
  "direction": "Anti horario",
  "length_km": 25.07,
  "category": "urbano",
  "provider": {
      "name": "B y V Transportes S.R.L.",
      "contact": {
         "phone": "381 661-6612",
         "email": "info@byvtransportes.com.ar",
         "address": "Av. Independencia 2365, San Miguel de Tucumán, Tucumán, Argentina",
         "website": "https://byvtransportes.com.ar/"
      }
   }
}
```

## Recorrido GEOJSON

```json
{
   "type": "FeatureCollection",
   "features": [
      {
         "type": "Feature",
         "geometry": {
            "type": "LineString",
            "coordinates": [
               [-65.22, -26.78],
               [-65.22, -26.78],
               /*and more...*/
            ]
         },
         "properties": { /*same that metadata.json*/ }
      }
   ]
}
```

## Paradas GEOJSON

```json
{
   "type": "FeatureCollection",
   "properties": { /*same that metadata.json*/  },
   "features": [
      {
         "type": "Feature",
         "geometry": {
            "type": "Point",
            "coordinates": [-65.22, -26.78]
         },
         "properties": {
            "name": "Inicio Recorrido"
         }
      },
      /*and more...*/
   ]
}
```

<br><br>

#### Scripts y metodos para actualizar los datos:

> [/src/utils/data](../src/utils/data)