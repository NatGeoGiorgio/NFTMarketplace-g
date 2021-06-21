import "./Home.css";
import React, { Component } from 'react'
import { Text,Flex,Loader, Button, Card, Input, Table, Form, Field, Image } from 'rimble-ui';

import teatro from '../img/teatro.jpeg';
import old from '../img/old.jpeg';
import protest from '../img/protest.jpeg';
import greta from '../img/greta.jpeg';
export default class Home extends Component {


  render(){
  return (
   
          <div >
           
          <Flex>

             <Image src={teatro} />

          </Flex>
        </div>
    
        );
      }
    }
     

   
 
