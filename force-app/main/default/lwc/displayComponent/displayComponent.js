import {LightningElement,track} from 'lwc';
import getSearchData from'@salesforce/apex/ContactsData.getSearchData';
import getContactRecords from'@salesforce/apex/ContactsData.getContactRecords';
import getTotalContacts from'@salesforce/apex/ContactsData.getTotalContacts';
import deleteContacts from '@salesforce/apex/ContactsData.deleteContacts';
import savecontact from '@salesforce/apex/ContactsData.savecontact';
import {updateRecord} from 'lightning/uiRecordApi';
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FIELD from '@salesforce/schema/Contact.LastName';
import PHONE from '@salesforce/schema/Contact.Phone';
import EMAIL from '@salesforce/schema/Contact.Email'
import ID_FIELD from '@salesforce/schema/Contact.Id';
import {ShowToastEvent} from 'lightning/platformShowToastEvent';
const actions = [
    {label: 'Record Details', name: 'record_details'}, 
    {label: 'Edit', name: 'edit'}, 
    {label: 'Delete', name: 'delete'}];
const columns = [
{label: 'Name', fieldName: 'linkName', type: 'url', 
typeAttributes:{label: { fieldName: 'Name'},target: '_blank'}},
{label: 'Accountname', fieldName: 'AccountlinkName', type: 'url',
typeAttributes:{label: { fieldName: 'AccountId'},target: '_blank'}},
{label: 'Phone', fieldName: 'Phone', type: 'phone',editable:'true'}, 
{label: 'Email', fieldName: 'Email', type: 'email'},
{label:'Contact Owner alias',fieldName:'OwnerlinkName',type:'text',
typeAttributes:{label:{fieldName:'OwnerId'},target:'_blank'}},
{
  type: 'action',
    typeAttributes: {rowActions: actions,menuAlignment: 'right'}
}];
export default class DisplayComponent extends LightningElement 
{
@track displayingmessage=false;
@track ConRecord = 
{
    FirstName : '',
    LastName : '',
    Phone :'',
    Email :''
};
 @track newView=false;
@track record=[];
@track draftValues = [];
@track name;
@track count='';
@track search='';
@track key='';
@track openmodel = false;
@track isEditForm=false;
@track selectedItemValue='All Contacts';
@track data;
@track columns=columns;
@track currentRecordId;
constructor()
{
    super();
    this.handelonload(this.selectedItemValue,this.key);
}
//Whole DataTable process
Handelmainload(result)
{
    window.console.log(result);
    if(result)
    { 
        let currentdata=[];
        result.forEach(function(record)
        {
        let currentlist={};
        window.console.log('-'+record.Name);
        currentlist.Id=record.Id;
        currentlist.Name=record.Name;
        currentlist.linkName='/'+record.Id;
        currentlist.Phone=record.Phone;
        currentlist.Email=record.Email;
        if(record.Account)
        {
            currentlist.AccountlinkName='/'+record.Account.Id;
            currentlist.AccountId =record.Account.Name;
        }
        currentlist.OwnerlinkName=''+record.Owner.Name
        currentdata.push(currentlist);
        })
        window.console.log('--'+currentdata);
        this.data=currentdata;
        this.error=undefined;      
    }
    else if(result.error)
    {
        window.console.log('error'+result.error);
        this.data=undefined;
        this.error=result.error;
    }
}
//How to view on functionality
handelonload(value,word)
{
    window.console.log('----->'+this.search);
    window.console.log("in on load"+this.selectedItemValue);
    if(value === "My Contacts" || value === "Recently Viewed" || value === "All Contacts")  
    {
        window.console.log("in if");
         getContactRecords({MenuValue:value})
         .then(result =>
            {
                window.console.log("in then");
                this.Handelmainload(result);
                this.handlecount(this.selectedItemValue,this.key);
            })
            .catch(error =>
                {
                    Window.console.log(error);  
                })
    }
    if(this.search === "SEARCH")
    {
        window.console.log(word)
        getSearchData({SearchKeyWord:word})
        .then(result =>
            {
                window.console.log("in then"+result);
                this.Handelmainload(result);
                this.handlecount(null,this.key);
            })
            .catch(error =>
            {
                Window.console.log(error);  
            })
    }
}
//Menu button actions
handelButtonmenu(event)
{
    this.selectedItemValue = event.detail.value;
    window.console.log('--->'+this.selectedItemValue);
    this.handelonload(this.selectedItemValue,this.key);
}
//Dyanamic hearder value
get Header()
{
    return this.selectedItemValue;
}
//search functionality
handelsearch(evt)
{
    this.search="SEARCH";
    const isEnterKey = evt.keyCode === 13;
    if (isEnterKey)
    {
        this.key = evt.target.value;
        window.console.log(this.key);
        this.handelonload(null,this.key);
    } 
}
//count
handlecount(value,word)
{
    window.console.log("in count--->"+word);
    getTotalContacts({MenuValue:value,SearchKeyWord:word})
    .then(result=>
        {
            window.console.log("+++>"+result);
            if(result === 0)
                {
                    window.console.log("---------->"+this.displayingmessage);
                    this.displayingmessage=true;
                    window.console.log("---------->"+this.displayingmessage);
                }
            this.count=result;
        })
    .catch(error =>
    {
        window.console.log(error);
    })
}
//Dyanamic count value
get countvalue()
{
 return this.count;
}
//for new record
create()
{
    this.newView= true;
}
//New fileds values
firstNameChange(event)
{
    this.ConRecord.FirstName = event.target.value;
    window.console.log('Name ==> '+this.ConRecord.FirstName);
}

lastNameChange(event)
{
    this.ConRecord.LastName = event.target.value;
    window.console.log('Phone ==> '+this.ConRecord.LastName);
}

phoneChange(event)
{
    this.ConRecord.Phone = event.target.value;
    window.console.log('Type ==> '+this.ConRecord.Phone);
}

emailChange(event)
{
    this.ConRecord.Email = event.target.value;
    window.console.log('Industry ==> '+this.ConRecord.Email);
}
//save method to new
savenewrecord()
{
    window.console.log("in save record function"+this.ConRecord.LastName)
    if(this.ConRecord.LastName!=='')
    {
       window.console.log("IN IF");
    savecontact({objCon: this.ConRecord})
    
        .then(result => {
            // Clear the user enter values
            this.ConRecord = {};
            window.console.log('result ===> '+result);
            this.newView=false;
            // Show success messsage
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Success',
                    message: 'Contact Created Successfully!!',
                    variant: 'success'
                })
            );
            
        })
        .catch(error => {
            this.error = error.message;
        });
    }
    else
    {
        window.console.log("in else");
        this.dispatchEvent(
            new ShowToastEvent({
                title:'Error',
                message:'Fill the required Fields',
                variant:'error'
            })
        )
    }
}
//popup Model Open
openbox()
{
    this.openmodel = true;
}
closebox()
{
    this.openmodel = false;
    this.newView=false;
} 
//Inline draftvalues
Savemethod(event)
{
    window.console.log("in save---"+event.detail.draftValues);
    window.console.log("Id---"+event.detail.draftValues[0].Id);
    window.console.log("Show Proxy object accounts ", JSON.stringify(event.detail.draftValues[0])); 
    const fields = {};
    fields[ID_FIELD.fieldApiName] = event.detail.draftValues[0].Id;
    fields[FIRSTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].FirstName;
    fields[LASTNAME_FIELD.fieldApiName] = event.detail.draftValues[0].LastName;
    fields[PHONE.fieldApiName] = event.detail.draftValues[0].Phone;
    fields[EMAIL.fieldApiName] = event.detail.draftValues[0].EMAIL;

    const recordInput = {fields};
    window.console.log("recordInput----->"+JSON.stringify(recordInput));
    window.console.log("fields---"+fields);
    updateRecord(recordInput)
    .then(() => {
        window.console.log("then---");
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Success',
                message: 'Contact updated',
                variant: 'success'
            })
        );
        // Clear all draft values
        this.draftValues = [];
      
    }).catch(error => {
        window.console.log("catch---"+error);
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Error creating record',
                message: 'error',
                variant: 'error'
            })
        );
    });
    location.reload(true);

}
// handleing record edit form submit
handleSubmit(event)
 {
    // preventing default type sumbit of record edit form
    event.preventDefault();
    this.template.querySelector('lightning-record-edit-form').submit(event.detail.fields);
    this.openmodel = false
    this.dispatchEvent(new ShowToastEvent({
        title: 'Success!!',
        message: event.detail.fields.FirstName +' '+ event.detail.fields.LastName +' Contact updated Successfully!!.',
        variant: 'success'
    }),);
}
handleSuccess()
{
    //return refreshApex(this.refreshTable);
    location.reload(true);
}
//Row Actions
handleRowActions(event) 
{
    let actionName = event.detail.action.name;
    window.console.log('actionName ====> ' + actionName);
    let row = event.detail.row;
    window.console.log('row ====> ' + row);
    switch (actionName)
    {
         case 'record_details':
               this.viewCurrentRecord(row);
               break;
        case 'edit':
              this.editCurrentRecord(row);
              break;
        case 'delete':
              this.deleteCons(row);
              break;
              default:
    }
}
viewCurrentRecord(currentRow)
{
     this.openmodel = true;
     this.isEditForm = false;
     this.record = currentRow;
}
editCurrentRecord(currentRow)
{
    window.console.log("--->" +JSON.stringify(currentRow));
    // open modal box
    this.openmodel = true;
    this.isEditForm = true;
    // assign record id to the record edit form
    this.currentRecordId = currentRow.Id;
    window.console.log(this.currentRecordId);
}
deleteCons(currentRow)
{
    let currentRecord = [];
    currentRecord.push(currentRow.Id);
    this.showLoadingSpinner = true;
    // calling apex class method to delete the selected contact
    deleteContacts({lstConIds: currentRecord})
    .then(result => {
        window.console.log('result ====> ' + result);
        this.showLoadingSpinner = false;
        // showing success message
        this.dispatchEvent(new ShowToastEvent({
        title: 'Success!!',
                message: currentRow.FirstName + ' '+ currentRow.LastName +' Contact deleted.',
                variant: 'success'
            }),);
            // refreshing table data using refresh apex
            this.handleSuccess();
        })
        .catch(error => {
            window.console.log('Error ====> '+error);
            this.dispatchEvent(new ShowToastEvent({
                title: 'Error!!', 
                message: error.message, 
                variant: 'error'
            }),);
        });
    }
}