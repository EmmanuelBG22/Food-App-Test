//handle errors

const handleErrors = (e) => {
    console.log(e.message, e.code);
    let errors = { email: '', password: ''}

    //incorrect email
    if(e.message === 'incorrect email'){
        errors.email = 'your email is not registered'
    }

    if(e.message === 'incorrect password'){
        errors.password = 'your password is not correct'
    }

    //unique error code
    if(e.code===11000){
        errors.email = 'email already registered'
        return errors
    }

    //validation errors
    if(e.message.includes('user validation failed'))
    Object.values(e.errors).forEach(({properties}) =>{
        errors[properties.path] = properties.message;
    })
    return errors
}

module.exports = 
    handleErrors
