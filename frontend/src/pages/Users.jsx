import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row } from 'react-bootstrap'
import NavBar from '../components/Navbar'
import axios from 'axios'
import { Button, Form } from 'react-bootstrap'
import { FaArrowAltCircleRight, FaMinus, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'
import '../App.css';
import { FaAngleDoubleUp, FaAngleUp } from 'react-icons/fa'

export default function Users() {
    const [users, setUsers] = useState([])
    const navigate = useNavigate();
    const [error, setError] = useState(null); 
    const [adduser, setAddUser] = useState(false);
    const [username, setUsername] = useState(null);
    const [email, setEmail] = useState(null);
    const [password, setPassword] = useState(null);

    const [visible, setVisible] = useState(false);

    const topFunction = () => {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    const fetchUsers = async () => {
        try{
            let fetchedUsers = await axios.get('http://localhost:9001/get-users');

            setUsers(fetchedUsers.data.message);
            console.log(users);
        }
        catch(error){
            console.log(error.response.data.message);
            setError(error.response.data.message);
        }
    }

    const handleInsert = async (e) => {
        try{
            // e.preventDefault();


            if (!username || !email || !password){
                alert('enter all fields')
                return;
            }

            const response = await axios.post("http://localhost:9001/register", {email: email, username: username, password: password})
            console.log(response.data.message)


        }
        catch(error){
            console.log(error.response.data.message);
        }
        

    }

    const handleClick = (e, element) =>{
        e.preventDefault();
        navigate(`/users/:${element.id}`, {state: element} )  // add params id. 
    }

    const handleCreate = (e) =>{
        e.preventDefault();
        adduser? setAddUser(false): setAddUser(true);
    
    }

    const getUsername = (e) =>{
        e.preventDefault();
        setUsername(e.target.value)
        console.log(username)

    }

    const getEmail = (e) =>{
        e.preventDefault();
        setEmail(e.target.value)


        
    }

    const getPassword= (e) =>{
        e.preventDefault();
        setPassword(e.target.value)


        
    }


    useEffect(()=>{
        fetchUsers();
  
        window.addEventListener('scroll', topFunction);
        return () => {
          window.removeEventListener('scroll', topFunction);
        };

    },  [])

  return (
    <>
    <NavBar user ={true} />
     <Container className='d-flex justify-content-center'>
        <Row>
            <Button className='mt-4' onClick={handleCreate}>{!adduser?<FaPlus />: <FaMinus />}</Button>
            {error? 
            <Card className='mt-4'>
                <Card.Body>
                    <Card.Header>
                        {error} {/* Render error message */}
                    </Card.Header>
                </Card.Body>
            </Card>
            : null
            }

            {adduser ?
                <Card  className='mt-2'>
                        <Form className='p-3'>
                        <input type="text" name="prevent_autofill" id="prevent_autofill" style={{ display: 'none' }} autoComplete="new-password" />
                        <input type="password" name="prevent_autofill_password" id="prevent_autofill_password" style={{ display: 'none' }} autoComplete="new-password" />

                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Email" onChange={getEmail}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicUsername">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" placeholder="@Username" onChange={getUsername}/>
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" onChange={getPassword} />
                            </Form.Group>

                        
                            <Button variant="primary" type="submit" onClick={handleInsert}>
                                Insert
                            </Button>
                            </Form>
                    </Card> : null}

            {users.map((element, index)=> {
                return (
                    <Col md= {12} key = {index}>
                        <Card  className='mt-2'>
                            <Card.Body>
                                <div className="d-flex justify-content-between align-items-center">
                                    <Card.Text><span style={{fontWeight: 'bold'}}>User name: </span> {element.username}</Card.Text>
                                    <div>
                                        <Button variant="primary" size="sm" className="me-2" onClick={(e)=>handleClick(e, element)}>
                                            <FaArrowAltCircleRight />
                                        </Button>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>   
                    </Col>
                )
            })}
            
        </Row>

        <button
        style={{ display: visible ? 'block' : 'none' }}
        className='Scroll-to-top'
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
        <FaAngleUp />
        </button>     

     </Container>
    </>
  )
}
