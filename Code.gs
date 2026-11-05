/** My Medi Buddy survey bridge – deploy as a Web App, Execute as Me, access Anyone. */
const FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLScNw1agO3BJGlrWvyB2EDLyNJNBgPmX8_jsEOYrklcGpkE3-g/viewform";
const TITLES = [
  "1. How often do you visit Seva Medical Shop? / आपण सेवा मेडिकल शॉपला किती वेळा भेट देता?",
  "2. What do you usually visit the shop for? / आपण सहसा कोणत्या कारणासाठी दुकानात येता?",
  "3. How did you learn about Seva Medical Shop? / आपल्याला सेवा मेडिकल शॉपबद्दल माहिती कशी मिळाली?",
  "4. How easy is it to reach the shop? / दुकानापर्यंत पोहोचणे आपल्यासाठी किती सोपे आहे?",
  "5. When do you usually visit the shop? / आपण सहसा दुकानात कोणत्या वेळी येता?",
  "6. Are the medicines you need usually available? / आपल्याला हवी असलेली औषधे दुकानात सहसा उपलब्ध असतात का?",
  "7. If a medicine is unavailable, does the staff inform you? / औषध उपलब्ध नसल्यास कर्मचारी आपल्याला माहिती देतात का?",
  "8. How quickly does the staff check medicine availability? / औषध उपलब्ध आहे की नाही हे कर्मचारी किती लवकर तपासतात?",
  "9. How helpful is the staff when you ask questions? / आपण प्रश्न विचारल्यास दुकानातील कर्मचारी किती मदत करतात?",
  "10. How satisfied are you with the service provided by the staff? / कर्मचाऱ्यांनी दिलेल्या सेवेबद्दल आपण किती समाधानी आहात?",
  "11. How long do you usually wait at the billing counter? / बिलिंग काउंटरवर आपल्याला साधारण किती वेळ थांबावे लागते?",
  "12. Is the bill easy to understand? / दुकानाने दिलेले बिल समजण्यास सोपे असते का?",
  "13. Does your bill usually show the correct products and amounts? / आपल्या बिलामध्ये खरेदी केलेली उत्पादने आणि रक्कम योग्य असते का?",
  "14. Which payment method do you usually use? / आपण सहसा पेमेंटसाठी कोणती पद्धत वापरता?",
  "15. How convenient is the payment process? / दुकानातील पेमेंट प्रक्रिया आपल्याला किती सोयीची वाटते?",
  "16. How does the staff communicate with you? / दुकानातील कर्मचारी आपल्याशी कसे बोलतात?",
  "17. How confident are you about receiving medicines in proper, sealed packaging? / औषधे योग्य आणि सीलबंद पॅकिंगमध्ये मिळतात याबद्दल आपल्याला किती विश्वास आहे?",
  "18. If a product is unavailable, is the reason explained clearly? / एखादे उत्पादन उपलब्ध नसल्यास त्याचे कारण आपल्याला स्पष्टपणे सांगितले जाते का?",
  "19. How satisfied are you with the cleanliness of the shop? / दुकानाच्या स्वच्छतेबद्दल आपण किती समाधानी आहात?",
  "20. Are you comfortable asking staff questions about products or bills? / औषधे किंवा बिलाबद्दल कर्मचाऱ्यांना प्रश्न विचारताना आपल्याला सहज वाटते का?",
  "21. Overall, how satisfied are you with your shopping experience? / एकूण खरेदीच्या अनुभवाबद्दल आपण किती समाधानी आहात?",
  "22. Would you recommend Seva Medical Shop to family or friends? / आपण सेवा मेडिकल शॉपची शिफारस कुटुंबीयांना किंवा मित्रांना कराल का?",
  "23. Would a digital copy of your bill be useful? / बिलाची डिजिटल प्रत मिळाल्यास ती आपल्यासाठी उपयुक्त ठरेल का?",
  "24. Which digital service would be most useful to you? / खालीलपैकी कोणती डिजिटल सेवा आपल्यासाठी सर्वाधिक उपयुक्त ठरेल?",
  "25. Which area should the shop improve? (Select one) / दुकानाने कोणत्या बाबतीत सुधारणा करावी? (एक पर्याय निवडा)"
];
function doGet(){return ContentService.createTextOutput("My Medi Buddy survey endpoint is running.");}
function doPost(e){
  try {
    const p=JSON.parse(e.postData.contents||"{}");
    if(!Array.isArray(p.answers)||p.answers.length!==TITLES.length) throw new Error("Expected 25 answers");
    const form=FormApp.openByUrl(FORM_URL), items=form.getItems(), byTitle={};
    items.forEach(x=>byTitle[x.getTitle()]=x);
    const response=form.createResponse();
    TITLES.forEach((title,i)=>{
      const item=byTitle[title], answer=p.answers[i];
      if(!item) throw new Error("Question not found in target form: "+title);
      if(typeof answer!=="string"||!answer.trim()) throw new Error("Missing answer: "+(i+1));
      if(item.getType()!==FormApp.ItemType.MULTIPLE_CHOICE) throw new Error("Question is not multiple choice: "+(i+1));
      const mc=item.asMultipleChoiceItem();
      if(!mc.getChoices().some(c=>c.getValue()===answer)) throw new Error("Invalid choice: "+(i+1));
      response.withItemResponse(mc.createResponse(answer));
    });
    response.submit();
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    console.error(err&&err.stack?err.stack:err);
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(err)})).setMimeType(ContentService.MimeType.JSON);
  }
}
