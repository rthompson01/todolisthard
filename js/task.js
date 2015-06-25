import Backbone from 'backbone'

/* 
Task {
    [String]title 
    [Date] due_date
    {lat, long} Location
    
    Boolean isUrgent
    String progress --> [done, started, cancelled, upcoming]
    }
*/

export const Task = Parse.Object.extend({
    className: 'Task',

defaults : {
    title: '(no title)',
    description:'(no description)',
    due_date: null,
    location: null,
    progress: 'upcoming',
    isUrgent: false
}

})

export const Tasks = Parse.Collection.extend({

    model:Task
})