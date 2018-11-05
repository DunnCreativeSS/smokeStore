import React, {Component} from 'react'
import Card, {CardActions, CardContent} from 'material-ui/Card'
import Button from 'material-ui/Button'
import FileUpload from 'material-ui-icons/FileUpload'
import auth from './../auth/auth-helper'
import TextField from 'material-ui/TextField'
import Typography from 'material-ui/Typography'
import Icon from 'material-ui/Icon'
import PropTypes from 'prop-types'
import {withStyles} from 'material-ui/styles'
import {create} from './api-product.js'
import {Link, Redirect} from 'react-router-dom'
import {read, update} from '../user/api-user.js'

const styles = theme => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing.unit * 5,
    paddingBottom: theme.spacing.unit * 2
  },
  error: {
    verticalAlign: 'middle'
  },
  title: {
    marginTop: theme.spacing.unit * 2,
    color: theme.palette.openTitle,
    fontSize: '1.2em'
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing.unit * 2
  },
  input: {
    display: 'none'
  },
  filename:{
    marginLeft:'10px'
  }
})

class NewProduct extends Component {
  constructor({match}) {
    super()
    this.state = {
      name2: '',
      name: '',
      description: '',
      images: [],
      category: '',
      quantity: '',
      price: '',
      redirect: false,
      error: ''
    }
    this.match = match
  }
  componentDidMount = () => {
    const jwt = auth.isAuthenticated()
    read({
      userId: jwt.user._id
    }, {t: jwt.token}).then((data) => {
      if (data.error) {
        this.setState({error: data.error})
      } else {
        this.setState({name: data.name, password:data.hashed_password, email: data.email, seller: data.seller})
      }
    })

  
    this.productData = new FormData()
  }
  handleChange = name => event => {
    const value = name === 'image'
      ? event.target.files[0]
      : event.target.value
    this.productData.set(name, value)
    this.setState({ [name]: value })

  }

  clickSubmit = () => {
    var t = this;
        var permlink = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();

    this.productData.set('name', this.state.name2)

    this.productData.set('password', this.state.password)

    this.productData.set('permlink', permlink)
    this.productData.set('author', this.state.name)

    const jwt = auth.isAuthenticated()
    
    create({
      password: t.state.password,
      name: t.state.name,
      name2: t.state.name2,
      shopId: this.match.params.shopId
    }, {
      password: t.state.password,
      name: t.state.name,
      name2: t.state.name2,
      shopId: this.match.params.shopId,
      t: jwt.token
    }, this.productData).then((data) => {
     if (data.error) {
        this.setState({error: data.error})
      } else {
        var body = '![](http://burstytools.trade:3000/api/product/image/'+data._id+')';
    body += '<br>' + this.productData.get('description');
    body+='<br>for $'+ this.productData.get('price'); 
    body +='<br>permlink in product data: ' + data.permlink + '-post';
      steem.broadcast.comment(
    this.productData.get('password'),
    '',
    'tfwbazaar', // Main tag
    this.productData.get('author'), // Author
    permlink + '-post', // Permlink
    this.productData.get('name'), // Title
    body, // Body
    { tags: ['listing', this.match.params.shopId, this.productData.get('category') ], app: 'tradeitforweed/marketplace' }, // Json Metadata
    function(err, result) {
    console.log(err, result);
    var msg;
    for (var r in err){
      msg+=err[r]
    }
console.log(msg)
console.log(result);    }
    );steem.broadcast.commentOptions(
    this.productData.get('password'),
    this.productData.get('author'), 
    permlink + '-post', // Permlink
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
          console.log(result)
        });
        this.setState({error: '', redirect: true})
      }
    })
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to={'/seller/shop/edit/'+this.match.params.shopId}/>)
    }
    const {classes} = this.props
    return (<div>
      <Card className={classes.card}>
        <CardContent>
          <Typography type="headline" component="h2" className={classes.title}>
            New Product - Remember that you need to space your products five+ minutes apart in roder for them to post on Smoke.io!
          </Typography><br/>
          <input accept="image/*" onChange={this.handleChange('image')} className={classes.input} id="icon-button-file" type="file"/>
          <label htmlFor="icon-button-file">
            <Button variant="raised" color="secondary" component="span">
              Upload Photo
              <FileUpload/>
            </Button>
          </label> <span className={classes.filename}>{this.state.image ? this.state.image.name : ''}</span><br/>
          <TextField id="name2" label="Name" className={classes.textField} value={this.state.name2} onChange={this.handleChange('name2')} margin="normal"/><br/>
          <TextField
            id="multiline-flexible"
            label="Description"
            multiline
            rows="2"
            value={this.state.description}
            onChange={this.handleChange('description')}
            className={classes.textField}
            margin="normal"
          /><br/>
          <TextField id="category" label="Category" className={classes.textField} value={this.state.category} onChange={this.handleChange('category')} margin="normal"/><br/>
          <TextField id="quantity" label="Quantity" className={classes.textField} value={this.state.quantity} onChange={this.handleChange('quantity')} type="number" margin="normal"/><br/>
          <TextField id="price" label="Price" className={classes.textField} value={this.state.price} onChange={this.handleChange('price')} type="number" margin="normal"/><br/>
          {
            this.state.error && (<Typography component="p" color="error">
              <Icon color="error" className={classes.error}>error</Icon>
              {this.state.error}</Typography>)
          }
        </CardContent>
        <CardActions>
          <Button color="primary" variant="raised" onClick={this.clickSubmit} className={classes.submit}>Submit</Button>
          <Link to={'/seller/shop/edit/'+this.match.params.shopId} className={classes.submit}><Button variant="raised">Cancel</Button></Link>
        </CardActions>
      </Card>
    </div>)
  }
}

NewProduct.propTypes = {
  classes: PropTypes.object.isRequired
}

export default withStyles(styles)(NewProduct)
