import React, { useEffect, useState } from 'react'
import { Button, Card, Container, Form } from 'react-bootstrap'
import { FaEdit, FaTrash } from 'react-icons/fa'
import { useLocation, useNavigate } from 'react-router-dom';
import NavBar from '../components/Navbar';
import axios from 'axios'

export default function UserDetails() {
    const navigate = useNavigate()
    const location = useLocation();
    const content = location.state
    const [edit, setEdit] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userState, setUserState] = useState({id: content.id});


    const handleEdit = () => {
        // console.log(edit)
        edit? setEdit(false) : setEdit(true);
    }


    const handleDelete = async (e) => {
        try{
            e.preventDefault();
            const confirmation = window.confirm(`Are you sure you want to delete user: ${content.username}?`);
            
            if (confirmation){
                const response = await axios.delete(`http://localhost:9001/delete-user/${content.id}`)
                // console.log(response.data.message)
                navigate('/users')
                
            }
        }
        catch(error){
            console.log(error.response.data.message);
        }
        

    }

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();

            console.log("Sending state: "+ JSON.stringify(userState))

            const response = await axios.patch("http://localhost:9001/update-user", userState)
            console.log(response.data.message)

            navigate('/users')

        }
        catch(error){
            console.log(error.response.data);
            const errorMessage = error.response.data.error?.sqlMessage ?? error.response.data.message;

            alert(errorMessage);
        }
        

    }

    const getUsername = (e) =>{
        e.preventDefault();
        const {name, value} = e.target
        setUsername(value)
        setUserState({...userState, username: value})
        // console.log(username)

    }

    const getEmail = (e) =>{
        e.preventDefault();
        const {name, value} = e.target
        setEmail(value)
        setUserState({...userState, email: value})


        
    }

    const getPassword= (e) =>{
        e.preventDefault();
        const {name, value} = e.target
        setPassword(value)
        setUserState({...userState, password: value})


        
    }


    useEffect(() => {
        setUserState({ id: content.id });
      }, [content]); // Ensure useEffect runs when content changes
    




  return (
    <>
    <NavBar user={false}/>
    <Container> 
        <Card  className='mt-2'>
            <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <Card.Text>Username: {content.username}</Card.Text>
                        <Card.Text>Email: {content.email}</Card.Text>
                        <Card.Text>Password: {content.password}</Card.Text>
                    </div>
                
                    <div>
                        <Button variant="primary" size="sm" className="me-2" onClick={handleEdit}>
                            <FaEdit />
                        </Button>
                        <Button variant="danger" size="sm" onClick={handleDelete}>
                            <FaTrash />
                        </Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
        {edit ?<Card  className='mt-2'>
            <Form className='p-3' autoComplete='off'>

            <input type="text" name="prevent_autofill" id="prevent_autofill" style={{ display: 'none' }} autoComplete="new-password" />
            <input type="password" name="prevent_autofill_password" id="prevent_autofill_password" style={{ display: 'none' }} autoComplete="new-password" />


                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder={content.email} onChange={getEmail}  autoComplete="new-email" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" placeholder={content.username} onChange={getUsername}  autoComplete="new-username" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder={content.password} onChange={getPassword}  autoComplete="new-username" />
                </Form.Group>

               
                <Button variant="primary" type="submit" onClick={handleSubmit}>
                    Update
                </Button>
                </Form>
        </Card> : null}
    </Container>
    </>
  )
}
