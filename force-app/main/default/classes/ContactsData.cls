public with sharing class ContactsData
 {
    @AuraEnabled
    public static List<contact> getContactRecords(String MenuValue)
    {
        System.debug('--->>'+MenuValue);
        List<contact> condetails=new List<contact>();
        if(MenuValue=='My Contacts')
        {	   
            condetails=[SELECT Account.Name,Id,Name,Phone,Email,AccountId,Owner.Name,OwnerId FROM contact WHERE OwnerId=:UserInfo.getUserId()];
        	System.debug(condetails);
        }
    	else if(MenuValue=='Recently Viewed')
     	{
         condetails=[SELECT Account.Name,Id,Name,Phone,Email,AccountId,Owner.Name FROM contact WHERE LastViewedDate !=null ];
     		System.debug(condetails);
        }
        else
        {
         condetails=[SELECT Account.Name,Id,Name,Phone,Email,AccountId,Owner.Name FROM contact];
            System.debug(condetails);
     	}    
        return condetails; 
    }

    @AuraEnabled
    public static List<contact> getSearchData(String SearchKeyWord)
    {
        System.debug(SearchKeyWord);
         String searchKey = SearchKeyWord + '%';
        System.debug(searchKey);
        List<contact> returnList=new List<contact>();
        List<contact> condetails=[SELECT Account.Name,Id,Name,Phone,Email,AccountId,Owner.Name,OwnerId,FirstName,LastName
                                  FROM contact WHERE Name LIKE: searchKey OR Account.Name LIKE: searchKey OR FirstName LIKE: searchKey OR LastName LIKE:searchKey];
        System.debug(condetails);
        	for(contact con:condetails)
        	{
           	 returnList.add(con);
        	}
        return returnList;
    }
    //Comment
    @AuraEnabled
    public static Integer getTotalContacts(String SearchKeyWord,String MenuValue)
    {
        integer condetails;
        if(MenuValue =='My Contacts')
        {	   
            String UserId=UserInfo.getUserId();
        condetails=database.countQuery('SELECT count() FROM contact WHERE OwnerId=:UserId');
        	System.debug(condetails);
        }
    	else if(MenuValue=='Recently Viewed')
     	{
        condetails=database.countQuery('SELECT count() FROM contact WHERE LastViewedDate !=null');
        System.debug(condetails);
        }
        else if(MenuValue=='All Contacts')
        {
            condetails=database.countQuery('SELECT count() FROM contact');
            System.debug(condetails);
     	}    
        else
        {
            System.debug('in else '+SearchKeyWord);
             String searchKey = SearchKeyWord + '%';
            condetails=database.countQuery('SELECT count() FROM contact WHERE Name LIKE: searchKey OR Account.Name LIKE: searchKey OR FirstName LIKE: searchKey OR LastName LIKE:searchKey');
            System.debug(condetails);
        }
        return condetails;
    }  
    @AuraEnabled
    public static void deleteContacts(list<Id> lstConIds)
    {
        System.debug(lstConIds);
        try 
        {
            list<Contact> lstConsToDelete = new list<Contact>();
            System.debug('lstConIds ====> '+lstConIds);
            for(Id idCon : lstConIds)
            {
                lstConsToDelete.add(new Contact(Id = idCon));
            }
            if(!lstConsToDelete.isEmpty())
            {
                delete lstConsToDelete;
            }
        }
        catch(Exception ex)
        {
            throw new AuraHandledException(ex.getMessage());
        }
    }
    @AuraEnabled
    public static void savecontact(Contact objCon)
    {
        insert objCon;
    }
}