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
            <div>
          <Flex>

             <Image src={teatro} />
              <Text>
               Giorgio
              </Text>

          </Flex>
          </div>
          <div>
          <Flex>
            <Card width={[ 256, 320 ]} mx='auto'>
             <Image src={greta} />
              <Text>
               Giulio
              </Text>
            </Card>
          </Flex>
          </div>
          <div>
          <Flex>
            <Card width={[ 256, 320 ]} mx='auto'>
             <Image src={protest} />
              <Text>
               Giorgio
              </Text>
            </Card>
          </Flex>
          </div>
        </div>
    
        );
      }
    }
     

   
 
