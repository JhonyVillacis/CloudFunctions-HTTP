import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as cors from 'cors';
import * as express from 'express';
import * as bodyParser from 'body-parser';


const firebaseHelper = require('firebase-functions-helper');

admin.initializeApp(functions.config().firebase);

const db = admin.firestore();
const app = express();
app.use(cors({ origin: true}));
const main = express();
const contactsCollection = 'contacts';
main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(bodyParser.urlencoded({ extended: false }));

export const apiweb = functions.https.onRequest(main);

// Add new contact
app.post('/contacts', async (req, res) => {
    try {
        const contact = {
            firstName: req.body['firstName'],
            lastName: req.body['lastName'],
            email: req.body['email']
        }
const newDoc = await firebaseHelper.firestore
            .createNewDocument(db, contactsCollection, contact);
        res.status(201).send(`Created a new contact: ${newDoc.id}`);
    } catch (error) {
        res.status(400).send(`Contact should only contains firstName, lastName and email!!!`)
    }        
})

// View all contacts
app.get('/contacts', (req, res) => {
    firebaseHelper.firestore
        .backup(db, contactsCollection)
        .then((data: any) => res.status(200).send(data))
        .catch((error: any) => res.status(400).send(`Cannot get contacts: ${error}`));
})

// View a contact
app.get('/contacts/:contactId', (req, res) => {
    firebaseHelper.firestore
        .getDocument(db, contactsCollection, req.params.contactId)
        .then((doc: any) => res.status(200).send(doc))
        .catch((error: any) => res.status(400).send(`Cannot get contact: ${error}`));
})