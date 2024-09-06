const Testimonial = require('../models/testimonial')
const Alumni = require('../models/alumni')


module.exports.showTestimonials = async (req, res) => {
    const testimonials = await Testimonial.find()
        .populate({
            path: 'alumniId', // Populate alumniId
            populate: { // Populate the userId inside the alumniId
                path: 'userId', // Reference to User
                select: 'profilePicture name' // Select only necessary fields from User
            }
        })

    res.render('testimonial/listTestimonial', { testimonials })

}

module.exports.newTestimonialForm = (req, res) => {
    res.render('testimonial/createTestimonial')
}

module.exports.editTestimonialForm = async (req, res) => {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
        req.flash('error', 'Testimonial not found!');
        return res.redirect('/testimonial');
    }
    res.render('testimonial/editTestimonial', { testimonial });
}

module.exports.createTestimonial = async (req, res) => {
    const { content } = req.body.testimonial
    const alumni = await Alumni.findOne({userId: req.user.id})
    const testimonial = new Testimonial({content, alumniId: alumni})
    await testimonial.save()
    res.redirect('/testimonial')
}

module.exports.deleteTestimonial = async (req, res) => {
    const { id } = req.params;
    await Testimonial.findByIdAndDelete(id);
    req.flash('success', 'Testimonial deleted successfully!');
    res.redirect('/testimonial');
}

module.exports.updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { content } = req.body.testimonial;
    const testimonial = await Testimonial.findByIdAndUpdate(id, { content });
    if (!testimonial) {
        req.flash('error', 'Testimonial not found!');
        return res.redirect('/testimonial');
    }
    req.flash('success', 'Testimonial updated successfully!');
    res.redirect(`/testimonial`);
}