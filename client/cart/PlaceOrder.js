import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import Button from 'material-ui/Button'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import auth from './../auth/auth-helper'
import cart from './cart-helper.js'
import {CardElement, injectStripe} from 'react-stripe-elements'
import {create} from './../order/api-order.js'
import {Redirect} from 'react-router-dom'
import request from 'es6-request'
const styles = theme => ({
  subheading: {
    color: 'rgba(88, 114, 128, 0.87)',
    marginTop: "20px",
  },
  checkout: {
    float: 'right',
    margin: '20px 30px'
  },
  error: {
    display: 'inline',
    padding: "0px 10px"
  },
  errorIcon: {
    verticalAlign: 'middle'
  },
  StripeElement: {
    display: 'block',
    margin: '24px 0 10px 10px',
    maxWidth: '408px',
    padding: '10px 14px',
    boxShadow: 'rgba(50, 50, 93, 0.14902) 0px 1px 3px, rgba(0, 0, 0, 0.0196078) 0px 1px 0px',
    borderRadius: '4px',
    background: 'white'
  }
})

class PlaceOrder extends Component {
  state = {
    order: {},
    error: '',
    redirect: false
  }

  placeOrder = ()=>{
      request.get('https://api.coinmarketcap.com/v2/ticker/1898/')
      .then(([data, res]) => {

data = JSON.parse(data)
console.log(data)
    var price = (data.data.quotes.USD.price);
    console.log(price)
    var amt = 0;
    for (var p in this.props.checkoutDetails.products){
      console.log(this.props.checkoutDetails.products[p].quantity );
      console.log(this.props.checkoutDetails.products[p].product.price)
      amt = amt + this.props.checkoutDetails.products[p].quantity * this.props.checkoutDetails.products[p].product.price
    }
    console.log(amt)
  var smoke=((amt / price).toString().substr(0, (amt / price).toString().indexOf('.')+3));
  console.log(this.props.checkoutDetails.customer_email)
  console.log(this.props.checkoutDetails.customer_name)
  console.log(smoke + '0')
steem_keychain.requestTransfer(this.props.checkoutDetails.customer_email,
 this.props.checkoutDetails.customer_name,
  smoke + '0', 'payment from store', 'SMOKE', function(response) {
  console.log(response);
      });
});
}

render() {

  console.log(this.props.checkoutDetails)
    const {classes} = this.props
    if (this.state.redirect) {
      return (<Redirect to={'/order/' + this.state.orderId}/>)
    }
    return (
    <span>
      <Typography type="subheading" component="h3" className={classes.subheading}>
        
      </Typography>

      <div className={classes.checkout}>
        { this.state.error &&
          (<Typography component="span" color="error" className={classes.error}>
            <Icon color="error" className={classes.errorIcon}>error</Icon>
              {this.state.error}
          </Typography>)
        }
        <Button color="secondary" variant="raised" onClick={this.placeOrder}>Place Order</Button>
      </div>
    </span>)
  }
}
PlaceOrder.propTypes = {
  classes: PropTypes.object.isRequired,
  checkoutDetails: PropTypes.object.isRequired
}

export default injectStripe(withStyles(styles)(PlaceOrder))
