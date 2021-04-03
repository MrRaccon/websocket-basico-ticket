
const TicketControl = require("../models/ticket-control");

const ticketControl = new TicketControl();



const socketController = (socket) => {
//se dispara cuando un cliente se conecta
    socket.emit('ultimo-ticket', ticketControl.ultima);
    socket.emit('estado-actual',ticketControl.ultimosCuatro);
    socket.emit('tickets-pendientes',ticketControl.tickets.length);

    socket.on('siguiente-ticket', (payload, callback) => {

        const siguiente = ticketControl.siguiente();
        callback(siguiente);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);

        //TODO notificar que hay un nuevo ticket pendiente de asignar
    })


    socket.on('atender-ticket', (payload, callback) => {

        const { escritorio } = payload;
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'El escritorio es obligatorio'
            });
        }



        const ticket=ticketControl.atenderTicket(escritorio);
        socket.broadcast.emit('estado-actual',ticketControl.ultimosCuatro);
        socket.broadcast.emit('tickets-pendientes',ticketControl.tickets.length);
        socket.emit('tickets-pendientes',ticketControl.tickets.length);


        if (!ticket) {
            callback({
                ok:false,
                msg:'no hay tickets pendientes'
            })
        }else{
            callback({
                ok:true,
                ticket
            })
        }

    })
}



module.exports = {
    socketController
}

