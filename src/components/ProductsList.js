import React, { Component } from "react";
import { connect } from "react-redux";
import {
  actionAddToEmptyShoppingList,
  actionAddToExistingShoppingList,
  actionRemoveOneTable,
  actionIncreaseByOne,
} from "../actions/actions.js";

class ProductsList extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleBuy = this.handleBuy.bind(this);
  }
  render() {
    let list = this.props.produkter.map((x, index) => (
      <div className="productsItem" key={index}>
        <h2>{x.namn}</h2>
        <p>{x.pris} EUR/ unit</p>
        <p>
          <em>{x.antal} units in stock</em>
        </p>
        <div className="image-button-item-group">
          <img
            src={require(`../images/bord${index}.jpg`)}
            alt="amazing table"
          />
          <button name={index} onClick={this.handleBuy}>
            ADD TO CART
          </button>
        </div>
      </div>
    ));
    return <ul className="productsList">{list}</ul>;
  }
  handleBuy = (event) => {
    let x = event.target.name;
    let howManyInStock = this.props.produkter[x].antal;
    let alreadyAdded = false;
    let index;
    for (let el in this.props.kundvagn.previous) {
      if (
        this.props.kundvagn.previous[el].namn === this.props.produkter[x].namn
      ) {
        alreadyAdded = true;
        index = el;
      }
    }
    if (!alreadyAdded && howManyInStock !== 0) {
      let action = actionAddToEmptyShoppingList({
        total:
          Number(this.props.shoppingbasket.total) +
          Number(this.props.produkter[x].pris),
        object: {
          namn: this.props.produkter[x].namn,
          pris: this.props.produkter[x].pris,
          antal: 1,
        },
      });
      this.props.dispatch(action);

      let newStateProdukter = [...this.props.produkter];
      newStateProdukter[x].antal = newStateProdukter[x].antal - 1;
      let updateStock = actionRemoveOneTable(newStateProdukter);
      this.props.dispatch(updateStock);
      this.props.dispatch(actionIncreaseByOne());
    } else if (alreadyAdded && howManyInStock !== 0) {
      let antal = this.props.kundvagn.previous[index].antal + 1;
      let action = actionAddToExistingShoppingList({
        index: index,
        antal: antal,
        total:
          Number(this.props.shoppingbasket.total) +
          Number(this.props.produkter[x].pris),
        lastAdded: {
          namn: this.props.produkter[x].namn,
          pris: this.props.produkter[x].pris,
          antal: 1,
        },
      });
      this.props.dispatch(action);
      let newStateProdukter = [...this.props.produkter];
      newStateProdukter[x].antal = newStateProdukter[x].antal - 1;
      let updateStock = actionRemoveOneTable(newStateProdukter);
      this.props.dispatch(updateStock);
      this.props.dispatch(actionIncreaseByOne());
    }
  };
}

let mapStateToProps = (state) => {
  return {
    produkter: state.produkter.present,
    kundvagn: state.kundvagn,
    shoppingbasket: state.kundvagn,
  };
};
export default connect(mapStateToProps)(ProductsList);
