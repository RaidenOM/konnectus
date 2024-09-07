const Event = require('../models/event')
const Staff = require('../models/staff')

module.exports.showEvents = async (req, res) => {
    const events = await Event.find({}).populate('createdBy');
    res.render('events/listEvents', { events });
}

module.exports.newEventForm = (req, res) => {
    res.render('events/createEvent');
}

module.exports.createEvent = async (req, res) => {
    const { title, description, date, location } = req.body.event;
    const staff = await Staff.findOne({userId: req.user.id})
    const event = new Event({ title, description, date, location, createdBy: staff.id });

    const image = req.file ? req.file.path : null;
    if(image) {
        event.image = image
    }


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

    // Find the event
    const event = await Event.findById(id);
    if (!event) {
        req.flash('error', 'Event not found!');
        return res.redirect('/events');
    }

    // Prepare the update data
    const updatedData = { title, description, date, location };

    // If a new image is uploaded, update the image field
    if (req.file) {
        updatedData.image = req.file.path; // Update with new image path
    }

    // Update the event
    await Event.findByIdAndUpdate(id, updatedData);
    req.flash('success', 'Event updated successfully!');
    res.redirect('/events');
}


module.exports.deleteEvent = async (req, res) => {
    const { id } = req.params;
    await Event.findByIdAndDelete(id);
    req.flash('success', 'Event deleted successfully!');
    res.redirect('/events');
}