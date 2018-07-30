console.log ('usmw js v 1.014');

_menu_edits = {};

_active_menu_leaf = null;

_main_menu_leaves = [];

_subleaf_active = false;

_menu_exit_timeout = null;
_active_menu_item = null;

_menu_debug = false;

_home_page_slides = {};

_home_page_slides.slides = [
               {img:'Molino.png', link:'#'},
               {img:'usmw-AY431.png', link:'#'},
               {img:'usmw-E404-K46-1851_i12.png', link:'item?content_id=12'},
               {img:'usmw-F865-R4_p106.png', link:'item?content_id=200'},
               {img:'usmw-GO7_6-84-228_i004.png', link:'item?content_id=174'},
               {img:'usmw-GO7_10-92-247.png', link:'item?content_id=199'},       
               {img:'usmw-GO28_1-910149.png', link:'item?content_id=214'},
               {img:'usmw-GO28_5-2002-44-1.png', link:'item?content_id=205'},
               {img:'usmw-GO28_6-9101245.png', link:'item?content_id=202'},
               
              ];

_home_page_slides.current = 2;



jQuery(document).ready(function() {
    
menu_setup('main-menu'); 
create_mobile_menu();
home_page_menu();
home_page_slideshow();
footer_fix();
});


function create_root_menu(id)
{
   if(!_usmw_menu_root_json)
    {
        console.log('menu root not found');
    } 
    
   var h = [];
   
   _root = JSON.parse(_usmw_menu_root_json);
   
   _root.forEach(function(m) {
       
      var label = m.label.toString();
      
      if(m.label == "Home") //home
      {
          m.link = site_root();
          
      }
      
      if(m.sublinks > 0)
      {
          m.link = '#';
          //label += arrow_down();
          
      }
      
      
      h.push('<li class="menu-'+_u_with_dash(m.label)+' usmw_menu"><a href="'+m.link+'">'+label+'</a></li>');
      
      
   });
   
 
   return '<div><ul id="'+id+'" class="links inline">' + h.join('') + '</ul></div>';
   
    
}

function menu_setup(menu_id)
{
    console.log('creating root menu');
    
    jQuery('#cssmenu').html(create_root_menu('main-menu'));
    
    
    if(!_usmw_menu_edits_json)
    {
        console.log('edits not found');
    }
    
    //menu_edits_parse();
    console.log('menu setup ' + _usmw_menu_edits_json);
    
    _menu_edits = JSON.parse(_usmw_menu_edits_json);
    
    _menu_edits.forEach(function(edit) {
        
        console.log('menu ' + edit.label);
        
        var m = build_menu_edit(edit);
        var dom_element = null;
        
        var attach = 'append';
        
        if(edit.parent && edit.append)
        {
            dom_element = get_leaf_item(edit.parent, edit.append);
            
        }
        
        else if(edit.parent && !edit.append)
        {
            console.log('no append ' + edit.parent);
            dom_element = get_leaf(edit.parent);
            attach = 'insert';
        }
        
        else {
            
            dom_element = get_menu_by_name('main-menu', edit.append);
        }

        
        if(dom_element && m)
        {
            
            
            if(attach == 'insert')
            {
                console.log('appending to ' + edit.parent);
                dom_element.append(m);
            }
            else if(!edit.root_included) {
                console.log('appending after ' + edit.append);
                dom_element.after(m);
            }
            
            else if(edit.root_included)
            {
                //jQuery('.menu-'+edit.drupal_tree_original).remove();
                jQuery('.menu-'+_u_with_dash(edit.label)).find('a').first().remove();
                jQuery('.menu-'+_u_with_dash(edit.label)).first().append(m);
                
            }
            
        }
        
        else {
            
            if(edit.parent)
            {
                console.log('error appending ' + edit.label + ' to parent ' + edit.parent + ' '  + dom_element);
            }
            else {
                
                console.log('error appending ' + edit.label + '  ' + dom_element);
            }
        }
        
    });
    
    
    setup_menu_interactions();
    
    if(_menu_debug)
    {
        jQuery('#page-wrapper').prepend('<div id="menu_debug" style="background:white;"> debug</div>');
    }
    
    console.log('main leaves ' + JSON.stringify(_main_menu_leaves));
    
}


function create_mobile_menu()
{
    console.log('creating mobile menu');
    var menu = create_root_menu('mobile-menu');
    
    jQuery('#cssmenu').append(menu);
    
    
    //condensing certain 3rd level menus to the 2nd level for mobile usabilty 
    var exceptions = [];
    exceptions['documents'] = {action:'insert_before', link_title:'images'};
    exceptions['people'] = {action:'insert_before', link_title:'images', prefix:'People - '};
    
    
    create_mobile_menu_leaves(exceptions);
    
    
    //toggle_menu_subpage(j, subpage_selector, lable_selector);
    //hide_all('.mobile_submenu');
    
    
    //hide
    jQuery('.mobile_submenu_header').each(function() {
       
       toggle_menu_subpage(jQuery(this), '.mobile_submenu', 'a');
    });
    
    
    hide_all('.mobile_submenu');
    
    
    jQuery('.mobile_submenu_header').each(function() {
       
        jQuery(this).find('a').first().click(function(event) {
            event.preventDefault();
            toggle_menu_subpage(jQuery(this).parent(), '.mobile_submenu', 'a');
        });
        
        
    });
    
    
}

function hide_all(selector)
{
    jQuery('.mobile_submenu').each(function() { jQuery(this).hide(); });
}

function setup_menu_interactions()
{
    
    hide_submenus();
    
    
    jQuery('.usmw_menu').each(function() {
       
       jQuery(this).mouseenter(function() {
           
           
           
           if(_active_menu_leaf && _active_menu_leaf.length > 0 && jQuery(this)[0] != _active_menu_leaf[0] && jQuery(this)[0] != _active_menu_leaf.parent[0]) //dom element comparison
           {
               console.log('hiding ' + tics())
               _active_menu_leaf.hide();
           }
           
           
           
           _active_menu_leaf = {};
           _active_menu_leaf.leaf = jQuery(this).find('.usmw_submenu').first();
           _active_menu_leaf.parent = jQuery(this);
           
           //console.log('active leaf ')
           
           if(_active_menu_leaf.leaf.hasClass('subleaf'))
           {
              hide_subleafs();
           }
           
           _active_menu_leaf.leaf.show();
           
           
           
          
       });
       
       
    });
    
    
    
    jQuery("li[class^='menu-']").each(function() {
        
       jQuery(this).mouseenter(function(){
           
        handle_menu_event('enter', 'menu-*');   
          
        var menu_class = jQuery(this).attr('class');
        
        
        if(menu_class.indexOf('subleaf_title') != -1)
        {
            console.log(menu_class);
            var parent = jQuery(this).data('parent');
            if(parent)
            {
                console.log('parent ' + parent);
                
                hide_main_leaves_but_one('leaf_'+_u_with_dash(parent));
                
            }
            
            
        }
        
        else if(menu_class.indexOf('usmw_menu') == -1){
            console.log(menu_class);
            hide_submenus();
        }
        
        else if(menu_class.indexOf('usmw_menu') != -1){
            
            hide_main_menus_but_one(menu_class);
        }
        
        
        
        
       });
       
    });
    
    
    
    jQuery('.usmw_submenu_link:not(.subleaf_link)').mouseenter(function() {
       
       hide_subleafs();
       
    });
    
    
    jQuery('.subleaf_title').mouseout(function() {
       
       menu_hide_timeout();
       
    });
    
    jQuery('.usmw_submenu_link').mouseout(function() {
       
       menu_hide_timeout();
       
    });
    //usmw_submenu_link 
    
    
    setInterval(function() {
        
        if(!is_hovering_on_menu())
          {
            console.log('non hovered, hiding');
            hide_submenus();
          }
      
    }, 770);
   
}

function menu_hide_timeout()
{
    if(_menu_exit_timeout)
    {
        clearTimeout(_menu_exit_timeout);
    }
    
    _menu_exit_timeout = setTimeout(function() {
          
          if(!is_hovering_on_menu())
          {
            console.log('non hovered, hiding');
            hide_submenus();
          }
          
       }, 340);
    
}

function is_hovering_on_menu()
{
    
    return isHovered('.subleaf_title') || isHovered('.subleaf_link') || isHovered('.usmw_submenu_link') || isHovered('.usmw_menu') ;
    
}

function hide_submenus()
{
    jQuery('.usmw_submenu').each(function() {
       
       jQuery(this).hide(); 
       
    });
}



function hide_main_menus_but_one(exclusion_class)
{
    jQuery("li[class^='menu-']").each(function() {
        
        var menu_class = jQuery(this).attr('class');
        
        if(menu_class != exclusion_class)
        {
            jQuery(this).find('.usmw_submenu').hide();
        }
    });
    
    
}

function hide_subleafs()
{
    console.log('hiding subleafs');
    jQuery('.subleaf').each(function() {
       
       jQuery(this).hide(); 
    });
    
}


function hide_main_leaves_but_one(exclusion)
{
    console.log('hide all but ' + exclusion);
    _main_menu_leaves.forEach(function(m) {
    
        if(exclusion && m != exclusion)
        {
            console.log('hiding ' + m);
            jQuery('#'+m).hide();
        }
        
    });
    
    
}



function handle_menu_event(type, label)
{
    if(type == 'enter')
    {
        
            //console.log('clearing menu timeout ' + label);
            
            //different timeout
            setTimeout(function() {
            menu_log('clearing menu timeout ' + label);
            
                if(_menu_exit_timeout)
                {
                    clearTimeout(_menu_exit_timeout);
                }
                
            }, 200);
            
        
    }
    
    else if(type == 'exit')
    {
        //console.log('x starting menu timeout ' + label);
        menu_log('x starting menu timeout ' + label);
        _menu_exit_timeout = setTimeout(function() {
            
           hide_submenus();
           
        }, 2000);
        
    }
    
}


function build_menu_edit(edit)
{
    var h = [];
    var extra = '';
    
    var title_extra = '';
    var data = '';
    
    var id = 'leaf_'+_u_with_dash(edit.label);
    
    if(!edit.parent)
    {
        _main_menu_leaves.push(id);
    }
    
    
    if(edit.parent)
    {
        title_extra = ' subleaf_title';
        data = ' data-parent="'+edit.parent+'" ';
    }
    
    if(!edit.root_included)
    {
        h.push('<li class="menu-'+ _u_with_dash(edit.label) +' usmw_menu '+title_extra+'" '+data+'>');
    }
    
    if(edit.parent)
    {
        h.push('<a href="#" '+data+'>'+edit.label.trim()+ arrow_right() + '</a>'); 
        extra = 'subleaf';
    }
    else {
        h.push('<a href="#" '+data+'>'+edit.label.trim()+ arrow_down() + '</a>');
    }
    
    
    if(extra == 'subleaf')
    {
        h.push('<div class="subleaf_anchor">');
    }
    
    h.push('<div id='+id+' class="usmw_submenu ' + extra + '">');
    
    
    if(edit.leaf && edit.leaf.length > 0)
    {
        edit.leaf.forEach(function(e) {
        
        var link = e.link;
        var leaf_extra = '';
        if(extra == 'subleaf')
        {
           leaf_extra = 'subleaf_link'; 
        }
        
        if(!edit.root_included)
        {
            link = site_root() + e.link;
        }
        
        h.push('<a class="usmw_submenu_link '+leaf_extra+'" href="'+link+'">'+e.label+'</a>');
        
        });
    
    }
    
    if(extra == 'subleaf')
    {
        h.push('</div>');
    }
    
    if(!edit.root_included)
    {
        h.push('</li>');
    }
    
    return h.join('');
    
}


function build_menu_edit_mobile(edit)
{
    var h = [];
    
    h.push(edit.label.trim()+ arrow_down());
    
    return h.join('');
    
}


function get_menu_by_name(container_id, n)
{
    
    var found = null;
    
    jQuery('#'+container_id+' li').each(function() {
    
       var li = jQuery(this);
       var a = jQuery(this).find('a');
       
       if(a.length > 0)
       {
           if(a.text().trim().toLowerCase() == n.trim().toLowerCase())
           {
               //console.log(' found menu ' + n);
               found = li;
               return false; //stop loop
           }
           
       }
       
       
    });
    
    
    return found;
    
}


function menu_log(s)
{
    console.log(s);
    if(_menu_debug)
    {
        //alert(jQuery('#menu_debug').length);
        jQuery('#menu_debug').html(s);
    }
    else
    {
        //alert(_menu_debug);
    }
}


function collect_edits_by_value(type, value)
{
    var collection = [];
    
    console.log('looking for ' + type + ' that match ' + value);
    
    _menu_edits.forEach(function(edit) {
    
        if(type == 'parent')
        {
            console.log(edit.parent);
            if(edit.parent == value)
            {
                collection.push(edit);
                
            }
            
            
        }
    
    
    });
    
    return collection;
}

function get_leaf(name)
{
    var l = jQuery('#leaf_'+_u_with_dash(name));
    if(l.length > 0)
    {
        return l;
    }
    
    console.log('leaf not found ' + name)
    return null;
    
}


function get_leaf_item(name, item) 
{
    console.log('looking for leaf item ' + name + ' ' + item);
    
    var l = jQuery('#leaf_'+_u_with_dash(name));
    
    var found = null;
    
    if(l.length > 0)
    {
        
        l.find('.usmw_submenu_link').each(function() {
             
            var t = _u_with_dash(jQuery(this).text());
            
            console.log('text ' + t);
            
            if(t == _u_with_dash(item))
            {
                console.log('found ' + t);
                found = jQuery(this);
                return false; //stop loop
            }
        
        });
    
    }
    
    return found;
    
}



function home_page_menu()
{
   var m = jQuery('#home_page_panels');
   
   if(m.length == 0) return;
   
   console.log('is homepage, rendering menu');
   
   var major_topics = collect_edits_by_value('parent', 'Major Topics');
   
   var h = [];
   
   var division = 5;
   var count = 0;
   
   major_topics.forEach(function(edit) {
      
      if(count == 0 )
      { h.push('<ol class="tree major_topics_tree_left">'); }
      
      if(count == division)
      {
        h.push('</ol>');
        h.push('<ol class="tree major_topics_tree_right">');
      }
      
      h.push('<div class="home_page_topic">');
      h.push('<div><label><strong>'+edit.label+'▾</strong></label></div>');
      
      if(edit.leaf)
      {
          var leaf_count = 0;
          edit.leaf.forEach(function(e)
          {
            if(leaf_count == 0)
            {
                h.push('<div class="home_page_leaf" style="display:none;">');
            }
              
            
            h.push('<div class="topic_label"><a href="'+e.link+'">'+e.label+'</a></div>');  
            
              
              
            leaf_count++; 
              
            if(leaf_count == edit.leaf.length )
            { h.push('</div>'); }  
              
          });
          
      }
      
      
      h.push('</div>');
      
      
      count++;
      
      if(count == major_topics.length )
      { h.push('</ol>'); }
      
   });
   
   m.find('#topics').append(h.join(''));
   
   //interactions
   jQuery('.home_page_topic').click(function () {
      
      var label = jQuery(this).find('label').text();
      
      console.log('clicked ' + label);
      
      home_page_topic_hide_all_but_active(label);
      
      toggle_home_page_topic(jQuery(this));
      
      
      
   });
   
}


function create_mobile_menu_leaves(exceptions)
{
    //similar to home page topic menu
    
    if(_menu_edits)
    {
        var dom_element = null;
        
        _menu_edits.forEach(function(edit) 
        {
            console.log('');
            
            var ex = exceptions[_u(edit.label)];
            console.log('checking for exceptions ' + _u(edit.label) + ' : '+ ex);
            
            
            var h = [];
            
            
            
            //var e = build_menu_edit_mobile(edit);
            
            if(edit.leaf && edit.leaf.length > 0)
            {
                edit.leaf.forEach(function(e) {
                    
                    //leaf_extra = '';
                    
                    var link = e.link;
                   
                    if(!edit.root_included)
                    {
                        link = site_root() + e.link;
                    }
                    
                    if(ex && ex.prefix)
                    {
                        e.label = ex.prefix + e.label;
                    }
                    
                    h.push('<a class="mobile_usmw_submenu_link" href="'+link+'">'+e.label+'</a>');
                    
                    
                    
                    
                });
                
                
            }
            
            
            var m = h.join('');

            if(edit.root_included)
            {
                var dom_element = jQuery('#mobile-menu .menu-'+_u_with_dash(edit.label));
                //mobile_submenu
                dom_element.addClass('mobile_submenu_header');
                dom_element.append('<div class="mobile_submenu">'+m+'</div>');
            }
            
            else if(edit.mobile_override && edit.append)
            {
                var override = '<li class="menu-'+_u_with_dash(edit.label)+' usmw_menu"><a href="'+edit.mobile_override+'">'+edit.label+'</a></li>';
                jQuery('#mobile-menu .menu-'+_u_with_dash(edit.append)).after(override);
                
            }
            
            else if(!edit.parent && edit.append) //top level
            {
                
                var wrap = '<li class="menu-'+_u_with_dash(edit.label)+' usmw_menu mobile_submenu_header"><a href="#">'+edit.label+'</a><div class="mobile_submenu">' + m + '</div></li>';
                jQuery('#mobile-menu .menu-'+_u_with_dash(edit.append)).after(wrap);
                
                
            }
            
            
            if(ex)
            {
                console.log('exception found' + JSON.stringify(ex));
                
                if(ex && ex.action && (ex.action == 'insert_before') && ex.link_title)
                {
                    var completed = false;
                    jQuery('#mobile-menu a').each(function() {
                       
                       if(_u_with_dash(jQuery(this).text()) == ex.link_title)
                       {
                           
                            jQuery(this).before(m);
                            
                            completed = true;
                       }
                       
                    });
                    
                    console.log('mobile - exception action completed: ' + completed);
                }
                
            }
            
        
            
            
        });
        
        
        
    }
    
}

//j = jQuery obj

function toggle_menu_subpage(j, subpage_selector, label_selector)
{
    
    j.find(subpage_selector).toggle();
    
    var label = j.find(label_selector).first();
      
    var txt = label.text();
      
    console.log(label_selector + label.length + ' ' + txt)
    
    if(txt.indexOf('▾') == -1 && txt.indexOf('▴') == -1)
    {
        txt += ' ▾';
    }
    
    else if(txt.indexOf('▾') != -1)
    {
        txt = txt.replace('▾','▴');
    }
    else
    {
         txt = txt.replace('▴','▾'); 
    }
      
    label.text(txt);
    
}



function toggle_home_page_topic(j)
{
    
    toggle_menu_subpage(j, '.home_page_leaf', 'label');
    
}


function home_page_topic_hide_all_but_active(active_label)
{
    //cache topics?
    jQuery('.home_page_topic').each(function() {
        
        var label = jQuery(this).find('label').text();
        if(label != active_label && label.indexOf('▴') != -1)
        {
            
            toggle_home_page_topic(jQuery(this));
            
            console.log('hiding ' + label);
            //txt = txt.replace('▾','▴');
        }
        
        
        
    });

    
    
}



function home_page_slideshow()
{   
   //_home_current_slide
   
   if(jQuery('#imagecontainer #image').length == 0)
   { return; }
   
   console.log('home page slideshow');
   
   setInterval(function () {
   
   var s = _home_page_slides.slides[_home_page_slides.current];
   
   if(_home_page_slides.current_slide_html)
   {
       _home_page_slides.previous_slide_html = _home_page_slides.current_slide_html;
   }
   
   var slide_update = '<div class="i"><a href="'+s.link+'"><img src="http://library-test.uta.edu/usmexicowar/themes/usmw/includes/'+s.img+'"></a></div>';
   
   _home_page_slides.current_slide_html = slide_update;
   
   
   var slideshow = jQuery('#imagecontainer #image');
   
   slideshow.html(_home_page_slides.previous_slide_html);
   
   var j = jQuery(_home_page_slides.current_slide_html);
   
   
   j.appendTo(slideshow);
   j.hide().fadeIn(800);
   //console.log('fade in');
   
   _home_page_slides.current++;
   
   if(_home_page_slides.current > _home_page_slides.slides.length -1)
   {
       
       _home_page_slides.current = 0;
   }
   
   //console.log('updated to slide ' + _home_page_slides.current);
       
   }, 2400);
   
   
}

//this is silly but issues with drupal block html filtering ...
function footer_fix()
{
    var count = 0;
    jQuery('#footer .content a').each(function() {
       
       if(count < 2)
       {
        jQuery(this).after('<div class="desktop_show_inline">&nbsp;|&nbsp;</div><div class="mobile_breaker"></div>');
       }
       count++;
    });
    
    
}

//https://stackoverflow.com/questions/8981463/
function isHovered(selector) {

    return jQuery(selector+":hover").length > 0
    
}


function arrow_down()
{
    return '<span class="arial"> ▾</span>';
}

function arrow_right()
{
    return '<span class="arial"> ▸</span>';
}

//unify text for comparisons, etc
function _u(t)
{ return String(t).trim().toLowerCase(); }

function _u_with_dash(t)
{ 
  var u = String(t).trim().toLowerCase(); 
  u = u.split(' ').join('-');
  return u;
}

function tics()
{ return new Date().getTime(); }


function now()
{ return new Date().getTime(); }

function site_root()
{ return 'http://library-test.uta.edu/usmexicowar/'; }




