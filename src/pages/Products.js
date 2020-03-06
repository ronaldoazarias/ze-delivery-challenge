import React, { Component, useEffect } from 'react';
import { gql } from 'apollo-boost';
import './Product.css';

import client from '../services/api';


export default class Products extends Component {
  state = {
    products: []
  };    

  lat = '000';
  lng = '111';
  /*componentDidMount(){
    this.getProducts(-23.632919, -46.699453);
  }*/

  getProducts = (lat, lng) => {
    console.log('lat: '+lat+' lng: '+lng);
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
          var pocId = result.data.pocSearch[0].id;
          console.log(pocId);
          console.log('iniciando consulta de produtos');
          client
            .query({
              query: gql`
                {  
                  poc(id: 532){
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
              this.setState({ products: result.data.poc.products });
            });
        })
    }

  renderProduct(product){
    return (
    <div className="card">
    <div className="img">
      <img src={product.images[0].url} />
    </div>
    <footer className="card-footer">
      <div className="card-footer-info">
        <strong>{product.title}</strong>
        <div className="price">
          <span><del>R$ {product.productVariants[0].price*1.20}</del></span>
          <strong>R$ {product.productVariants[0].price}</strong>
        </div>  
      </div>
      <div className="card-footer-qtd">
        <div className="card-footer-total">
          <div className="desc">
            Total
          </div>
          <div  className="value">
            R$ 10,99
          </div>
        </div>
        <div className="qtd">
         <a className="btn btn-qtd-change">-</a>
         <input type="number" className="qtd-input" />
         <a className="btn btn-qtd-change">+</a>
        </div>                 
        <a className="btn btn-add">Adicionar ao carrinho</a>              
      </div>
    </footer>
    </div>);
  }

  render () {
    const { products } = this.state;
    return (
      <div className="main-container">
        <div className="products">   
          <div className="cards">           
            {products.map(this.renderProduct)}
          </div>
        </div>        
      </div>
    );
    
  }
}