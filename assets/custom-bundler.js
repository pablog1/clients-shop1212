function ready(callbackFunc) {
  if (document.readyState !== 'loading') {
    // Document is already ready, call the callback directly
    callbackFunc();
  } else if (document.addEventListener) {
    // All modern browsers to register DOMContentLoaded
    document.addEventListener('DOMContentLoaded', callbackFunc);
  } else {
    // Old IE browsers
    document.attachEvent('onreadystatechange', function() {
      if (document.readyState === 'complete') {
        callbackFunc();
      }
    });
  }
}

ready(function() {
  
  let setChoice, size, combinedOptionsTitle;
  let container = document.querySelector(".custom-bundler__pdp");
  
  bundlerSelectionsGrid();
    
    container.addEventListener("click", (ev) => {
      console.log('click');
      
      if (ev.target.classList.contains("choice")) { // click a variant
        
        console.log('click variant');
        
        //if choice has "not-available", return
        if (ev.target.classList.contains("not-available")) {
         return; 
        }         
        
        // select options
        let type = ev.target.dataset.choice_type;
        let choice = ev.target.dataset.choice;
        let variants = ev.target.closest('.variants');    
        
        let productId = variants.dataset.product_id;

        let links = variants.querySelectorAll(".choice." + type);
        [...links].forEach((x) => x.classList.remove("active"));        
        ev.target.classList.add("active");
        
        //get options
        if(variants.querySelector(".choice.Size.active")) {
        	size = variants.querySelector(".choice.Size.active").dataset.choice;
        }
        let color = variants.querySelector(".choice.Color.active").dataset.choice;
        
        // console.log('choices =  ' + size + ' - ' + color);
        
        //write options
        let combinedOptions = variants.querySelector('.combined-options');
        if(size) {
          // console.log('size  = |' + size + '|' );
        	combinedOptionsTitle = color + ' / ' + size;
        } else {
        	combinedOptionsTitle = color;
        }
        combinedOptions.dataset.comb_options = combinedOptionsTitle;
        
        // console.log('control = ' + combinedOptionsTitle );
        
        //get from the variantsId list, the element with the same title value
        let variantAttrs = variants.querySelector("[data-title='" + combinedOptionsTitle + "']");
        let variantId = variantAttrs.dataset.value;
        let variantImg = variantAttrs.dataset.img;
        
        // console.log(variantId);
        
        //change image if possible
        
        if (type == "Color") {
          let card = ev.target.closest('.custom-bundler__pdp__item').querySelector(".card__img"); 
          card.innerHTML = '<img src="' + variantImg + '" >';
        }
    
        
        // set selected variantId  
        let selectedVariantEle = variants.querySelector('.selected-variant-id');
        selectedVariantEle.dataset.variant_id = variantId;
        
        // set "your selections fields"
        let yourSelections = document.querySelector('.product-id-' + productId);
        yourSelections.innerHTML =  "<picture class='card__img'><img src='" + variantImg + "'/></picture>";
        
        bundlerSelectionsGrid();
        checkAvailability(color, variants);
        size = '';
        color = '';
        
        //set variant texts
        variantsTexts(type, variants);
        
        
        
      } // end if click on variant
      
       if (ev.target.classList.contains("add-to-cart")) { // click add to cart
         
         // create json         
         let items = [], data = [];
         let variantIds = container.querySelectorAll("[data-variant_id]");
         [...variantIds].forEach((ele) => {
           data = {
              "id": ele.dataset.variant_id,
              "quantity": 1
           };
           
           items.push(data)
           addItemToCart(items);
          
         });  // end if.. add to cart   
          
           
           console.log('res ', items);
                        
         
         // add to cart
         function addItemToCart(items) {
 
          jQuery.ajax({
            type: 'POST',
            url: '/cart/add.js',
            data: { items: items },
            dataType: 'json',
            success: function() { 
                setTimeout(function() {
                	window.location = '/cart';
              	}, 500)
            }
          });
         }
         
         
         // check minicart behavior...
                  
       } // end click add to cart
      
      
    }); // end click listener
  
  
  	// Swatches - if it's a PDP, replace colors for images
  	if(container){
    	//for each
      	let imagePlaceHolder = [];
        imagePlaceHolder = container.querySelectorAll(".choice.Color.image");
         [...imagePlaceHolder].forEach((ele) => {
           //search on all-variants
            let allVariants= [];
           	allVariants = container.querySelectorAll(".all-variants [data-value]");
            [...allVariants].forEach((e) => {
              if(e.dataset.title.includes(ele.dataset.choice + ' /') || e.dataset.title == ele.dataset.choice){                
                ele.innerHTML = "<img src='" + e.dataset.swatch_img + "' />";
                 }
            });
           
         });
     }
  
    // check if color should be unavailable
  	if(container){
      let checkColors, colorOk = 0;
      
      let allVariants = container.querySelectorAll('.variants');
       [...allVariants].forEach((variantEle) => {
        colorOk = 0;
         
       	checkColors = variantEle.querySelectorAll(".choice.Color");
        [...checkColors].forEach((ele) => {
            let elements = [];
           	elements = variantEle.querySelectorAll(".all-variants [data-value]");
            [...elements].forEach((e) => {
              // console.log('aaaaa ' + e.dataset.title + ' --- ' + ele.dataset.choice + 'quant ' + e.dataset.quantity);
              if((e.dataset.title.includes(ele.dataset.choice + ' /') || e.dataset.title == ele.dataset.choice) && e.dataset.quantity > 0){                
                colorOk = 1;
                // console.log('bbbbbb ' + e.dataset.title + ' --- ' + ele.dataset.choice + ' quant ' + e.dataset.quantity);
              }
            });
          if(colorOk == 0) {
            // console.log('colorOk??');
          	ele.classList.add("not-available"); 
            ele.style = 'cursor:default';
          }
          colorOk = 0;
        });     
       }); // end foreach allVariants
     } // end if
  
  
  	// check if the sizes for the first color are available
    if(container){
      let checkColors, colorOk = 0, firstColor;
      
      let allVariants = container.querySelectorAll('.variants');
       [...allVariants].forEach((variantEle) => {
        colorOk = 0;
         
        // get first color
        firstColor = variantEle.querySelector(".choice.Color");
        
        if(firstColor) {
           // console.log('first color = ' + firstColor.dataset.choice); 
           checkAvailability(firstColor.dataset.choice, variantEle)
        }
        
         
       });
        /* 
       	checkColors = variantEle.querySelectorAll(".choice.Color");
        [...checkColors].forEach((ele) => {
            let elements = [];
           	elements = variantEle.querySelectorAll(".all-variants [data-value]");
            [...elements].forEach((e) => {
              // console.log('aaaaa ' + e.dataset.title + ' --- ' + ele.dataset.choice + 'quant ' + e.dataset.quantity);
              if((e.dataset.title.includes(ele.dataset.choice + ' /') || e.dataset.title == ele.dataset.choice) && e.dataset.quantity > 0){                
                colorOk = 1;
                // console.log('bbbbbb ' + e.dataset.title + ' --- ' + ele.dataset.choice + ' quant ' + e.dataset.quantity);
              }
            });
          if(colorOk == 0) {
            // console.log('colorOk??');
          	ele.classList.add("not-available"); 
            ele.style = 'cursor:default';
          }
          colorOk = 0;
        });     
       }); // end foreach allVariants
      
      */
     } // end if
  
  
  	
  	
  
  function checkAvailability(color, variants) {
    console.log('control check, color = ' + color);
    //check all sizes from the selected color
    let sizes = [], colors = [], links;
    let compareColor = color + ' /';
    
    //if sizes, set a "out of stock" class for the unavailable sizes, 
    links = variants.querySelectorAll(".choice.Size");
    if(links) {
      [...links].forEach((x) => {
        x.classList.remove("not-available");                                
      });

      sizes = variants.querySelectorAll(".all-variants [data-value]");
      [...sizes].forEach((e) => {
        if(e.dataset.title.includes(compareColor) && e.dataset.quantity == '0') {
          // console.log(compareColor + 'zz ', e.dataset.title + ' -- ' + e.dataset.quantity);   
          [...links].forEach((x) => {
              if(e.dataset.title.includes(x.dataset.choice)){
                  x.classList.add("not-available");  
              }                  
          });    
        }
      });
    } //end sizes!    
  } //end function
  
  
  function bundlerSelectionsGrid() { 
  
    //read all elements "custom-bundler__pdp__your-selection"
    let bundlerSelections = document.querySelectorAll('.custom-bundler__pdp__items .custom-bundler__pdp__your-selection');
    
    
    //populate the bundlerSelectionsGrid
    let bundlerSelectionsText = '';
    [...bundlerSelections].forEach((e) => {     
      bundlerSelectionsText = bundlerSelectionsText.concat(e.outerHTML);                              
    });
    
    let res = document.querySelector('.all-selections');
     res.innerHTML = '';
    res.innerHTML = bundlerSelectionsText;
  
  }
  
  function variantsTexts(variantName, variants) {
  	let element = variants.querySelector('.choice.' + variantName + '.active');
    variants.querySelector('.option-label[data-option='+variantName+']').innerHTML = variantName + ': ' + element.dataset.choice;
  }
    
}); // end ready function
