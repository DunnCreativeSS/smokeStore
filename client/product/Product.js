import React, {Component} from 'react'
import Card, {CardActions, CardHeader, CardMedia, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import FileUpload from 'material-ui-icons/FileUpload'
import auth from './../auth/auth-helper'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import Grid from 'material-ui/Grid'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {read, listRelated} from './api-product.js'
import {read2} from './../user/api-user.js'
import {Link} from 'react-router-dom'
import Suggestions from './../product/Suggestions'
import Reviews from './../product/Reviews'

import AddToCart from './../cart/AddToCart'
const styles = theme => ({
  root: {
    flexGrow: 1,
    margin: 30,
  },
  flex:{
    display:'flex'
  },
  card: {
    padding:'24px 40px 40px'
  },
  subheading: {
    margin: '24px',
    color: theme.palette.openTitle
  },
  price: {
    padding: '16px',
    margin: '16px 0px',
    display: 'flex',
    backgroundColor: '#93c5ae3d',
    fontSize: '1.3em',
    color: '#375a53',
  },
  media: {
    height: 200,
    display: 'inline-block',
    width: '50%',
    marginLeft: '24px'
  },
  icon: {
    verticalAlign: 'sub'
  },
  link:{
    color: '#3e4c54b3',
    fontSize: '0.9em'
  },
  addCart: {
    width: '35px',
    height: '35px',
    padding: '10px 12px',
    borderRadius: '0.25em',
    backgroundColor: '#5f7c8b'
  },
  action: {
    margin: '8px 24px',
    display: 'inline-block'
  }
})

class Product extends Component {
  constructor({match}) {
    super()
    this.state = {
      product: {shop: {}},
      reviews:[],
      msg:{},
      theRating:0,
      rating:'',
      review:'',
      aname:'',
      password:'',
      suggestions: [],
      suggestionTitle: 'Related Products'
    }
    this.match = match
  }
    handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    this.setState({ [name]: value })

  }

  clickSubmit = () => {
    var t = this;
    const jwt = auth.isAuthenticated()
    read({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      
            var permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
    var body =  this.state.rating + '/5';
    body+='<br>'+ this.state.review; 
    steem.broadcast.comment(this.state.password,
     t.state.product.author,
 t.state.product.permlink + '-post',
       this.state.aname,
        permlink+'-review',
         t.state.product.name,
       body, 
      { tags: ['tfwbazaar','review', t.state.product.shop._id ], app: 'tradeitforweed/marketplace' }, function(err, result) {

    console.log(err, result);
    var msg;
    for (var r in err){
      msg+=err[r]
    }
console.log(msg)
console.log(result);    }
    );steem.broadcast.commentOptions(
    this.state.password,
    this.state.aname, 
    permlink + '-review', // Permlink
    '1000000.000 SMOKE', 
      
    true, 
     true, 
     [ 
       [0, { 
         beneficiaries: [ 
           { account: 'tradeitforweed', weight: 1500 } 
         ] 
       }] 
       ]
        , function(err, result){
          console.log(err)
                t.setState({error: '', redirect: true})

          console.log(result)
        });
t.setState(error:'', redirect:true)
    })
  }
  loadProduct = (productId) => {
    var t = this;
    read({productId: productId}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {

        t.setState({product: data})
        listRelated({
          productId: data._id}).then((data) => {
          if (data.error) {
            console.log(data.error)
          } else {
            t.setState({suggestions: data})
          }
        })
        
     }
    })
  }
  componentDidMount = () => {
    var t = this;
    this.loadProduct(this.match.params.productId)
      const jwt = auth.isAuthenticated()
    read2({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({aname: data.error})
      } else {
        this.setState({aname: data.name, password:data.hashed_password})
      }
    
        steem.api.getContentReplies(t.state.product.author, t.state.product.permlink+'-post', function(err, result){
            //for (var r in result){
            console.log(err)
            console.log(result)
            var theRating = 0;
            for (var r in result){
              theRating = theRating  +((parseFloat(result[r].body.split('\n')[0].split('/')[0])))
            }
            theRating = theRating / (result.length)
        t.setState({reviews:result, theRating:theRating})

      });
    })


  }
  componentWillReceiveProps = (props) => {
    this.loadProduct(props.match.params.productId)
  }

  render() {
    const imageUrl = this.state.product._id
          ? `/api/product/image/${this.state.product._id}?${new Date().getTime()}`
          : '/api/product/defaultphoto'
    const {classes} = this.props
    console.log(this.state.product.permlink+'-post')
    console.log(this.state.product.author)
    console.log(this.state.reviews)
    return (
        <div className={classes.root}>
          <Grid container spacing={40}>
            <Grid item xs={7} sm={7}>
              <Card className={classes.card}>
                <CardHeader
                  title={this.state.product.name}
                  subheader={this.state.product.quantity > 0? 'In Stock': 'Out of Stock'}
                  action={
                    <span className={classes.action}>
                      <AddToCart cartStyle={classes.addCart} item={this.state.product}/>
                    </span>
                  }
                />
                <div className={classes.flex}>
                  <CardMedia
                    className={classes.media}
                    image={imageUrl}
                    title={this.state.product.name}
                  />
                  <Typography component="p" type="subheading" className={classes.subheading}>
                    {this.state.product.description}<br/>
                    Rating:{this.state.theRating}/5<br/>
                    <span className={classes.price}>$ {this.state.product.price}</span>
                    <Link to={'/shops/'+this.state.product.shop._id} className={classes.link}>
                      <span>
                        <Icon className={classes.icon}>shopping_basket</Icon> {this.state.product.shop.name}
                      </span>
                    </Link>
                  </Typography>

                </div>
              </Card>
              <ul>
              {this.state.reviews.map(function(player, i) {
                 return <li key={i}>{player.author}:{player.body}</li>
                 // -------------------^^^^^^^^^^^---------^^^^^^^^^^^^^^
              })}
              </ul>

              <Card className={classes.card}>
                      <CardContent>

               <TextField id="rating" label="Rating" className={classes.textField} value={this.state.rating} onChange={this.handleChange('rating')} margin="normal"/> / 5<br/>
          <TextField
            id="multiline-flexible"
            label="Review"
            multiline
            rows="2"
            value={this.state.description}
            onChange={this.handleChange('review')}
            className={classes.textField}
            margin="normal"
          /><br/>
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
        </CardActions>
           </Card> </Grid>
            
            {this.state.suggestions.length > 0 &&
              (<Grid item xs={5} sm={5}>
                <Suggestions  products={this.state.suggestions} title='Related Products'/>
              </Grid>)}
          </Grid>
        </div>)
  }
}

Product.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(Product)
