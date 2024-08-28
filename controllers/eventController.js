const Event = require('../models/event')

module.exports.showEvents = async (req, res) => {
    const events = await Event.find({});
    res.render('events/listEvents', { events });
}

module.exports.newEventForm = (req, res) => {
    res.render('events/createEvent');
}

module.exports.createEvent = async (req, res) => {
    const { title, description, date, location } = req.body.event;
    const event = new Event({ title, description, date, location, createdBy: req.user._id });
    await event.save();
    req.flash('success', 'Event created successfully!');
    res.redirect('/events');
}

module.exports.editEventForm = async (req, res) => {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
        req.flash('error', 'Event not found!');
        return res.redirect('/events');
    }
    res.render('events/editEvent', { event });
}

module.exports.updateEvent = async (req, res) => {
    const { id } = req.params;
    const { title, description, date, location } = req.body.event;
    const event = await Event.findByIdAndUpdate(id, { title, description, date, location });
    if (!event) {
        req.flash('error', 'Event not found!');
        return res.redirect('/events');
    }
    req.flash('success', 'Event updated successfully!');
    res.redirect(`/events`);
}

module.exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Event deleted successfully!');
    res.redirect('/events');
}