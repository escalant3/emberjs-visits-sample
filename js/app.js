var Visits = Em.Application.create();

// DEBUG MODE: Uncomment next line to show bindings logs
// Ember.LOG_BINDINGS = true;

Visits.Customer = Em.Object.extend({
  name: null,
  dateNextVisit: "",
  typeNextVisit: "",
  isDone: false,
  visitLog: Em.A([]),

  nextVisit: Ember.computed(function(key, value){
    //getter
    if (arguments.length === 1) {
      var date = this.get('dateNextVisit');
      var type = this.get('typeNextVisit');
      return type + " on " + date;
    // setter
    } else {
      var date = value[0];
      var type = value[1];

      this.set('dateNextVisit', date);
      this.set('typeNextVisit', type);

      return value;
    }
  }).property('dateNextVisit', 'typeNextVisit'),

  visitText: Em.computed(function(){
    return this.get('name') + " (" + 
      this.get('dateNextVisit') + " - " + 
      this.get('typeNextVisit') + ")";
  }).property('name', 'dateNextVisit', 'typeNextVisit')
});

Visits.VisitLog = Em.Object.extend({
  date: null,
  type: null
});

Visits.customerController = Em.ArrayController.create({
  content: [],

  selectedIndex: 0,

  createCustomer: function(name){
    if (this.getCustomer(name) === null) {
      var customer = Visits.Customer.create({ name: name });
      this.pushObject(customer);
    } else {
      alert("That customer already exists");
    }
  },

  getCustomer: function(name){
    for(var i=0;i<this.content.length;i++){
      if (name===this.content.get(i).name){
        return this.content.get(i);
      }
    }
    return null;
  },

  
  visitsTodo: Em.computed(function(){
    var table = this.filter(function(item, index, self){
      if (item.get('dateNextVisit') != null && item.get('dateNextVisit') !== "") {
        return true;
      }
    });
    return Em.A(table);
  }).property('@each.dateNextVisit'),

  selectedCustomer: Em.computed(function(){
    return this.toArray()[this.get('selectedIndex')];
  }).property('selectedIndex', '@each.name', 'content'),
    
  clearDoneVisits: function(){
    this.forEach(function(item, index, self){
      if (item.get('isDone')) {
        var visitLog = Visits.VisitLog.create({
          date: item.get('dateNextVisit'),
          type: item.get('typeNextVisit')
        });
        var itemLog = item.get('visitLog');
        itemLog.pushObject(visitLog);
        item.set('isDone', false);
        item.set('visitLog', itemLog);
        item.set('dateNextVisit', '');
        item.set('typeNextVisit', '');
      }
    });
  },

  getDebugDict: function(){
    var cdict = {}
    this.forEach(function(item){
      cdict[item.name] = item;
    })
    return cdict;
  }
});

Visits.CreateCustomerView = Em.TextField.extend({
  insertNewline: function() {
    var value = this.get('value');
    if (value) {
      Visits.customerController.createCustomer(value);
      this.set('value', '');
    }
  }
});

Visits.VisitsTodoView = Em.CollectionView.extend({
  contentBinding: Em.Binding.oneWay('Visits.customerController.visitsTodo'),
  itemViewClass: Em.Checkbox.extend({
    //template: Em.Handlebars.compile('{{content.name}} - {{content.dateNextVisit}}'),
    titleBinding: 'content.visitText',
    valueBinding: 'content.isDone',
    classNames: ['ui-li', 'ui-li-static', 'ui-body-a'],
  })
});

Visits.CustomersView = Em.CollectionView.extend({
  //NOTE Formerly known as itemView
  itemViewClass: Em.View.extend({
    classNames: ['ui-li', 'ui-li-static', 'ui-body-a'],
    mouseDown: function(evt) {
      //NOTE How to access the index of the clicked element
      var selectedIndex = this.get('collectionView').get('childViews').indexOf(this);
      Visits.customerController.set('selectedIndex', selectedIndex);
    }
  })
});

Visits.CustomerDetailView = Em.View.extend({
  customerBinding: 'Visits.customerController.selectedCustomer',
  visitType: Em.TextField.extend({
    valueBinding: 'Visits.customerController*selectedCustomer.typeNextVisit',
  }),
  visitDate: Em.TextField.extend({
    valueBinding: 'Visits.customerController*selectedCustomer.dateNextVisit',
  }),
  visitLogBinding: 'Visits.customerController*selectedCustomer.visitLog'
})

