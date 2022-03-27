import React, { Component } from 'react';

import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import RouteService from '../../services/RouteService'
import RecipientService from '../../services/RecipientService'
import DriverService from '../../services/DriverService'

const recipientService = new RecipientService();
const routeService = new RouteService();
const driverService = new DriverService();


/**
 * This class is used to display a history of all routes 
 * created in the system.
 */
class History extends Component {

    /**
     * The constructor method initializes the component's state object and
     * binds the methods of the component to the current instance.
     * @param {Object} props The properties passed to the component.
     */
    constructor(props) {
        super(props);
        this.state = {
            routes: [],
            route: {
                itinerary: [], total_distance: "", total_duration: "",
                total_quantity: "", first_name: "", last_name: ""
            },
            recipients: [],
            driver: { capacity: "", employee_status: "" }
        };

        this.getRecipientName = this.getRecipientName.bind(this)
        this.getPhone = this.getPhone.bind(this)
    }

    /**
     * Life cycle hook that is called after the component is first rendered.
     */
    componentDidMount() {
        let params = this.props.match.params

        recipientService.getRecipients().then(result => {
            this.setState({
                recipients: result
            })
        })

        routeService.getRoute(1).then(result => {
            this.setState({
                route: result
            })
        })

        routeService.getRoutes().then(result => {
            this.setState({
                routes: result
            })
        })

        driverService.getDriver(params.driverId).then(result => {
            this.setState({
                driver: result
            })
        })
    }

    /**
     * Function to return full name for individual recipients. Called 
     * for each client in the itinerary for each driver's route.
     * @param {Object} recipient Recipient object from the route.
     * @returns Client's full name.
     */
    getRecipientName(recipient) {
        let clients = this.state.recipients
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === recipient.id) {
                return clients[i].first_name + " " + clients[i].last_name
            }
        }
    }

    /**
    * Function that returns the clients comment if present. Called for each client
    * in the itinerary for each driver's route.
    * @param {Object} recipient Recipient object from the route.
    * @returns The clients comment section
    */
    getRecipientComment(recipient) {
        let clients = this.state.recipients
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === recipient.id) {
                if (clients[i].comments !== undefined) {
                    return clients[i].comments
                }
                else {
                    return ""
                }
            }
        }
    }

    /**
     * Function that returns the clients room number if present. Called for each client
     * in the itinerary for each driver's route
     * @param {Number} recipient Recipient object from the route
     * @returns The clients room number
     */
    getRecipientRoomNumber(recipient) {
        let clients = this.state.recipients
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === recipient.id) {
                if (clients[i].location.room_number !== undefined && clients[i].location.room_number !== "N/A") {
                    return clients[i].location.room_number
                }
                else {
                    return ""
                }
            }
        }
    }

    /**
     * Function to return phone number for individual recipients. Called 
     * for each client in the itinerary for the driver's route.
     * @param {Object} recipient Recipient object from the route.
     * @returns Client's phone number.
     */
    getPhone(recipient) {
        let clients = this.state.recipients
        for (let i = 0; i < clients.length; i++) {
            if (clients[i].id === recipient.id) {
                return clients[i].phone
            }
        }
    }

    /**
     * The render method used to display the component. 
     * @returns The HTML to be rendered.
     */
    render() {
        return (
            <main className="content">
                <div className="row">
                    <Container>
                        {this.state.routes.map(r =>
                            <Table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Address</th>
                                        <th>Apt #</th>
                                        <th>City</th>
                                        <th>State</th>
                                        <th>Zip Code</th>
                                        <th>Phone Number</th>
                                        <th>Quantity</th>
                                        <th>Comments</th>
                                    </tr>
                                </thead>
                                {r.itinerary.map(s =>
                                    <tbody>
                                        <tr>
                                            <td>{this.getRecipientName(s)}</td>
                                            <td>{s.address.address}</td>
                                            <td>{this.getRecipientRoomNumber(s) ? this.getRecipientRoomNumber(s) : ""}</td>
                                            <td>{s.address.city}</td>
                                            <td>{s.address.state}</td>
                                            <td>{s.address.zipcode}</td>
                                            <td>{this.getPhone(s)}</td>
                                            <td>{s.demand}</td>
                                            <td>{this.getRecipientComment(s)}</td>
                                        </tr>
                                    </tbody>
                                )}
                            </Table>
                        )}
                    </Container>
                </div>
            </main>
        )
    }
} export default History