"use strict";

// es5 polyfills, powered by es5-shim
require("es5-shim")
    // es6 polyfills, powered by babel
require("babel/register")

// var Promise = require('es6-promise').Promise
// equivalent to...
import {
    Promise
}
from 'es6-promise'
import Backbone from 'backbone'
import React from 'react'
import {
    Task, Tasks
}
from './task'
    // import Parse from 'parse'
import $ from 'jquery'
Parse.initialize('7d4xF2t6x46pKTZR68ryd8a2fmgRnuvW29Gz4LQj', 'FzXhFsATfQQKZuTSo81Tj8Bft06L8az9017eSaJu')

window.Parse = Parse
Parse.$ = $


const list = new Tasks()
list.query = new Parse.Query(Task)

class TaskView extends React.Component {
        constructor(props) {
            super(props)
            this.rerender = () => {
                this.props.data.save()
                this.forceUpdate()
            }
        }
    }

componentDidMount() {
    this.props.data.on('change', this.rerender)
}
componentDidUnmount() {
    this.props.data.off('change', this.rerender)
}
_toggleDone() {
    var model = this.props.data
    var progress = model.get('progress')
        if (progress !== 'done') {
            model.set('progress', 'done')
            } else {
            model.set('progress', 'upcoming')
            }
}
_toggleUrgent() {
    var model = this.props.data
    var urgent = model.get('isUrgent')
        if (urgent !== true) {
            model.set('isUrgent', true)
            } else {
            model.set('isUrgent', false)
            }
}
_saveTitle() {
    var text = React.findDOMNode(this.refs.title).innerText
        this.props.data.set('title', text)
        }
_saveDes() {
    var texts = React.findDOMNode(this.refs.description).innerText
        this.props.data.set('description', texts)
}
_saveDate() {
    var date = React.findDOMNode(this.refs.date).value
        this.props.data.set('due_date', date)
}

render() {
    var model = this.props.data
    var date = model.get('due_date')
        return (<li className) = {
                    model.get('progress')+ ' ' +model.get('isUrgent')
                } >
                <p contentEditable ref = "title"
                onBlur = {
                    () => this._saveTitle()
                } > {
                    model.get('title')
                } </p> <p contentEditable ref = "description"
                onBlur = {
                    () => this._saveDes()
                } > {
                    model.get('description')
                } </p> <input type = "checkbox"
                checked = {
                    model.get('progress') === 'done'
                }
                onChange = {
                    () => this._toggleDone()
                }
                <div> <input type = "checkbox"
                checked = {
                    model.get('isUrgent') === true
                }
                onChange = {
                    () => this._toggleUrgent()
                }> <span>Urgent</span>  </input> <input type = "date"
                ref = "date"
                value = {
                    date
                }
                onChange = {
                    () => this._saveDate()
                }
                />
             </div>
        </li>)
}

class ListView extends React.Component {
    constructor(props) {
        super(props)
            this.rerender = () => this.forceUpdate()
                }
    componentDidMount() {
        this.props.data.on('update sync', this.rerender)
                }
    componentDidUnmount() {
        this.props.data.off('update sync', this.rerender)
                }
_add(e) {
    e.preventDefault()
    var input = React.findDOMNode(this.refs.title)
    var model = new Task({
        title: input.value
                    })
    var acl = new Parse.ACL()
        acl.setWriteAccess(Parse.User.current(), true)
        acl.setReadAccess(Parse.User.current(), true)
        acl.setPublicReadAccess(false)
        model.setACL(acl) {
            this.props.data.create(model)
                input.value = ''
                }
_logOut(e) {
    e.preventDefault()
    var logout = React.findDOMNode(this.refs.out)
        Parse.User.logOut()
            window.location.hash = 'login'
                }

render() {
    return (<div>
            <form> className = "logout"
                onSubmit = {
                    (e) => this._logOut(e)
                                } >
                                < button ref = "out" > Log Out < /button> </form >

     < form onSubmit = {
    (e) => this._add(e)
        } >
        <div> <input ref = "title" />
        </div> <button> + </button> </form> <ul> {
            this.props.data.map((model) => < TaskView data = {
                                            model
                                        }
                                        />)} 
            </ul>
            </div>))
            }
            }

class LoginView extends React.Component {
    constructor(props) {
        super(props)
            this.state = {
                error: 0
        }
    }
}

_signupOrLogin(e) {
e.preventDefault()
    var u = new Parse.User(),
        email = React.findDOMNode(this.refs.email).value,
        password = React.findDOMNode(this.refs.password).value

u.set({
    email: email,
    password: password,
    username: email
})

var signup = u.signUp()
    signup.then(() => window.location.hash = "#list")
    signup.fail(() => {

var login = u.logIn()
    login.then((e) => window.location.hash = "#list")
    login.fail((...args) => {
    this.setState({
        error: this.state.error + 1
            })
        })
    })
}

render() {
var error = this.state.error ? ( <p className = 'error-message' > {
this.state.error
}
try -password invalid </p>) : ' '
return (<div>
    <form onSubmit = {
        (e) => this._signupOrLogin(e)
        } >
            <p> login or register: </p> <hr/>
            <div> <input type = "email"
            ref = 'email'
            placeholder = "email address" /> </div> < div> <input type = 'password'
            ref = 'password'
            plaeholder = 'password' / > < /div> {
                    error
            } <div> <button> Submit </button> </div>
            </form>  </div> )
    }
}

var Router = Parse.Router.extend({
    routes: {
        'list': 'list',
        '*default': 'login'
},

initialize: () => {
    Parse.history.start()
},

list: () => {
    if (!Parse.User.current()) {
        window.location.hash = 'login'
            return
}
list.fetch()
React.render(<ListView data = {
    list} />document.querySelector('.container'))
        },
login: () => {
    if (Parse.User.current()) {
        window.location.hash = 'list'
    return
}
React.render(<LoginView/> , document.querySelector('.container'))
    }
     })

console.log(list);

var router = new Router()
}
