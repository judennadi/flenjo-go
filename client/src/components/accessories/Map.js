import { useEffect } from "react";

const Map = (props) => {
  const onScriptLoad = () => {
    let options = {
      center: props.latLng,
      zoom: 15,
    };

    const mapId = document.getElementById(props.id);
    const map = new window.google.maps.Map(mapId, options);
    let marker = new window.google.maps.Marker({
      position: props.latLng,
      map,
    });
    console.log(marker);
  };

  useEffect(() => {
    if (window.google) {
      onScriptLoad();
    } else {
      let script = document.createElement("script");
      script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAcZIPxaBDt0PTKBe4nzJSl7uhp_bFSThc";
      document.body.appendChild(script);

      script.addEventListener("load", (e) => {
        onScriptLoad();
      });
    }
  });

  return <div style={{ width: "100%", height: "100%" }} id={props.id}></div>;
};

export default Map;
