const path = require('path');
const fs = require('fs');
const Ticket = require('./ticket');




class TicketControl {

    constructor() {
        this.ultima = 0;
        this.hoy = new Date().getDate();//11,23,5
        this.tickets = [];
        this.ultimosCuatro = [];
        //lee el archivo
        this.init();
    }


    get toJson() {
        return {
            ultima: this.ultima,
            hoy: this.hoy,
            tickets: this.tickets,
            ultimosCuatro: this.ultimosCuatro
        }
    }

    init() {
        const { ultima, hoy, tickets, ultimosCuatro } = require('../db/data.json');
        if (hoy === this.hoy) {
            this.tickets = tickets;
            this.ultima = ultima;
            this.ultimosCuatro = ultimosCuatro;
        } else {
            //es otro dia
            this.guardarDb();
        }
    }

    guardarDb() {
        const dbPath = path.join(__dirname, '../db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson))
    }


    siguiente() {
        this.ultima += 1;
        const ticket = new Ticket(this.ultima, null);
        this.tickets.push(ticket);
        this.guardarDb();
        return 'Ticket ' + ticket.numero;
    }

    atenderTicket(escritorio) {
        //no tenemos tickets
        if (this.tickets.length === 0) {
            return null
        }
        const ticket = this.tickets.shift();//quita primer elemento y lo elimina
        ticket.escritorio = escritorio;
        this.ultimosCuatro.unshift(ticket);//agrega elemento al inicion
        if (this.ultimosCuatro.length > 4) {
            this.ultimosCuatro.splice(-1, 1);
        }
        console.log(this.ultimosCuatro)
        this.guardarDb();
        return ticket;
    }


}


module.exports = TicketControl;