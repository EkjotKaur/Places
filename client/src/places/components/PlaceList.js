import React from "react";

import Card from "../../shared/components/UIElement/Card";
import PlaceItem from "./PlaceItem";
import "./PlaceList.css";
import Button from "../../shared/components/FormElements/Button";

const PlaceList = (props) => {
  if (props.items.length === 0) {
    return (
      <div className="place-list center">
        <Card>
          <h2>No Places Found! Maybe Create One?</h2>
          <Button to="/places/new" >Share Place</Button>
        </Card>
      </div>
    );
  }

  return (
    <ul className="place-list">
      {props.items.map(place => (
        <PlaceItem
          key={place.id}
          id={place.id}
          image={place.image}
          title={place.title}
          description={place.description}
          address={place.address}
          creatorId={place.creatorId}
          onDelete={props.onDeletePlace}
        />
      ))}
    </ul>
  );
};

export default PlaceList;
