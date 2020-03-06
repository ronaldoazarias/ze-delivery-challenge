import React, { useState }  from 'react';
import Script from 'react-load-script';
import { gql } from 'apollo-boost';
import './App.css';
import './Product.css';
import client from './services/api';

const App = () => {

  const [ products, setProducts ] = useState([]);

  const getProducts = (lat, lng) => {
    let dt = new Date().toISOString();
    client
      .query({
        query: gql`
          {
            pocSearch(algorithm: "NEAREST",
                      lat: "${lat}",
                      long: "${lng}",
                      now: "${dt}") {
              id
            }
          }
        `
        })  
        .then(result => {
          if(result.data.pocSearch.length < 1){
            alert('Infelizmente ainda não há fornecedores na sua região')
            return -1;
          }          
          let pocId = result.data.pocSearch[0].id;
          client
            .query({
              query: gql`
                {  
                  poc(id: ${pocId}){
                    id
                    products(search: ""){
                      id
                      title
                      images{
                        url
                      }                
                      productVariants{
                        price
                        imageUrl
                      }
                    }
                  }
                }
              `
            })
            .then(result => {
              console.log('Obteve retorno dos produtos');
              console.log(result.data.poc.products);
              setProducts(result.data.poc.products);
              document.querySelector('.loading').style.display = 'none';
              document.querySelector('.main-container').style.display = 'flex';              
            });
        })
    }

  const addItem = (product) =>{
    console.log(product);
  }

  const removeItem = (product) =>{
    console.log(product);
  }  

  const handleScriptLoad = () => {
    var input = document.getElementById('ad');
    var autocomplete = new window.google.maps.places.Autocomplete(input);
    autocomplete.addListener('place_changed', function() {
      document.querySelector('.main-container').style.display = 'none';
      document.querySelector('.loading').style.display = 'flex';
      var place = autocomplete.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng()
      getProducts(lat, lng);
    });    

    var inputSmall = document.getElementById('ad-small');
    var autocompleteSmall = new window.google.maps.places.Autocomplete(inputSmall);
    autocompleteSmall.addListener('place_changed', function() {
      document.querySelector('.main-container').style.display = 'none';
      document.querySelector('.loading').style.display = 'flex';
      var place = autocompleteSmall.getPlace();
      let lat = place.geometry.location.lat();
      let lng = place.geometry.location.lng()
      getProducts(lat, lng);
    });    
 
  };

  return (
    <div className="app">
      <Script
        url="https://maps.googleapis.com/maps/api/js?key=AIzaSyALUs6-3FS7iWq4opzE08MYnkoMtWcTLng&libraries=places"
        onLoad={handleScriptLoad}
      />      
      <header>
        <link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
        <link href="https://fonts.googleapis.com/css?family=Montserrat&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css?family=Spartan&display=swap" rel="stylesheet"></link>
        <div className="header">          
          <div className="small-area">
            <img className="logo" src="logo-completo.png" />
          </div>
          <div className="large-area">
            <input type="text" id="ad" className="header-input" placeHolder="Digite o seu endereço"/>
          </div>
          <div className="header-small-cart">
            <div className="header-small-cart-img">
              <img className="header-small-cart-img" src="cart.png" /> 
            </div>
            <div className="header-small-cart-value">
              <span>R$ 286,98</span>
            </div>
          </div>
        </div>
        <div className="header-small">          
          <img className="logo" src="small-logo.png" />
          <input type="text" id="ad-small" className="header-input" placeHolder="Digite o seu endereço"/>
          <div className="header-small-cart">
            <div className="header-small-cart-img">
              <img className="header-small-cart-img" src="cart.png" /> 
            </div>
            <div className="header-small-cart-value">
              <span>R$ 286,98</span>
            </div>
          </div>
        </div>
      </header>
      <body className="body">
        <div class="loading">
          <img src="loading-beer.gif" />
        </div>
        <div className="main-container">
          <div className="products">                  
              { products.length > 0 ? (
                <div className="cards">       
                { products.map(product => (
                  <div className="card" key={product.id}>
                  <div className="img">
                    <img src={product.images[0].url} />
                  </div>
                  <footer className="card-footer">
                    <div className="card-footer-info">
                      <strong>{product.title}</strong>
                      <div className="price">
                        <span><del>R$ {(product.productVariants[0].price*1.20).toFixed(2)}</del></span>
                        <strong>R$ {product.productVariants[0].price.toFixed(2)}</strong>
                      </div>  
                    </div>
                    <div className="card-footer-qtd">
                      <div className="card-footer-total">
                        <div className="desc">
                          Total
                        </div>
                        <div  className="value">
                          R$ {(product.productVariants[0].price*10).toFixed(2)}
                        </div>
                      </div>
                      <div className="qtd">
                       <a className="btn btn-qtd-change" onClick={() => removeItem(product)}>-</a>
                       <input type="number" className="qtd-input"  value="10" />
                       <a className="btn btn-qtd-change" onClick={() => addItem(product)}>+</a>
                      </div>                 
                      <a className="btn btn-add">Adicionar ao carrinho</a>              
                    </div>
                  </footer>
                  </div>
                ))}
                </div>
              ) :
              (<div className="home">
                 <strong>Informe o seu endereço no campo acima para verificarmos os produtos disponíveis para a sua região.</strong>
                 <img className="img-beer" src="beer.jpg" />
               </div>)}
          </div>        
        </div>        
      </body>
      <footer className="footer">
        <div className="company">
          <img className="company-socials-logo" src="logo-completo.png" />
          <div className="company-socials">
            <a href="https://twitter.com/ZeDelivery" className="company-socials-icon" target="_blank">
              <img className="company-socials-icon" src="twitter.png" />
            </a>
            <a href="https://www.facebook.com/zedeliverydebebidas" className="company-socials-icon" target="_blank">
              <img className="company-socials-icon" src="facebook.png" />
            </a>
            <a href="https://www.instagram.com/zedelivery/?hl=pt" className="company-socials-icon" target="_blank">                          
              <img className="company-socials-icon" src="instagram.png" />
            </a>
          </div>
        </div>
        <div className="created-by">
          <div>Criado por:</div>
          <div className="created-by-me">            
            Ronaldo Azarias
          </div>    
          <div className="created-by-contacts">
            <div className="created-by-flex-row">
              <img src="linkedin.png" />
              <a href="https://www.linkedin.com/in/ronaldo-azarias-dos-santos-776a135a/">
                Linkedin
              </a>
            </div>           
            <div className="created-by-flex-row">
              <img src="mail.png" />
              <a href="mailto:ronaldo.azarias01@gmail.com">ronaldo.azarias01@gmail.com</a>
            </div>           
            <div className="created-by-flex-row">
              <img src="phone.png" />
              <span>+55 (11) 97078-2735</span>
            </div>                               
            </div>       
        </div>        
      </footer>
    </div>
  );
}

export default App;
