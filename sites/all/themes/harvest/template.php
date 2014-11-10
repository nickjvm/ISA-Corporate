<?php

function harvest_form_alter(&$form, &$form_state, $form_id) {
  if ($form_id == 'search_block_form') {
    $form['search_block_form']['#title'] = t('Search'); // Change the text on the label element
    $form['search_block_form']['#title_display'] = 'invisible'; // Toggle label visibilty
    //$form['search_block_form']['#size'] = 40;  // define size of the textfield
    $form['actions']['submit']['#value'] = t('search'); // Change the text on the submit button
    $form['actions']['submit']['#attributes']['class'][] = 'btn btn-primary'; // Change the text on the submit button
    // Add extra attributes to the text box
    //$form['search_block_form']['#attributes']['onblur'] = "if (this.value == '') {this.value = 'Search';}";
    //$form['search_block_form']['#attributes']['onfocus'] = "if (this.value == 'Search') {this.value = '';}";
    // Prevent user from searching the default text
    //$form['#attributes']['onsubmit'] = "if(this.search_block_form.value=='Search'){ alert('Please enter a search'); return false; }";
    // Alternative (HTML5) placeholder attribute instead of using the javascript
    $form['search_block_form']['#attributes']['placeholder'] = t('Search by topic or keyword');
    $form['search_block_form']['#attributes']['type'] = 'search';
  }

  if($form_id == "user_login_block") {
      $form['actions']['submit']['#attributes']['class'][]= "btn btn-primary";
  }


  if (!empty($form['actions']) && $form['actions']['submit']) {
    $form['actions']['submit']['#attributes'] = array('class' => array('btn', 'btn-primary'));
  }

}
function harvest_preprocess_page(&$variables) {
    $variables['isa_now'] = "<img class='isa-now-logo' src='/".drupal_get_path('theme', 'harvest')."/img/iowa-soybean-now.png' alt='Iowa Soybean Now'/>";
    $variables['jumbotron'] = views_embed_view('jumbotron','block');
    $variables['page_head_image'] = views_embed_view('page_image','block_1');
    $main_menu_tree = menu_tree_all_data('main-menu');
      // Add the rendered output to the $main_menu_expanded variable
      $variables['main_menu_expanded'] = menu_tree_full("main-menu");
         if (isset($variables['node'])) {

            $variables['submitted'] = t('Published on @date', array('@date' => date("l, F jS, Y", $variables['node']->created)));
        }

}

function harvest_preprocess_node(&$vars, $hook) {
    $vars['submitted'] = t('Published on @date by !user', array('!user' => $vars['name'],'@date' => date("l, F jS, Y", $vars['created'])));
}
function harvest_preprocess_block(&$variables, $hook) {
    if($variables['block']->delta >= 2 && $variables['block']->delta <=5) {
       // $variables['']
    }
    //print_r($variables);
}

function menu_tree_full($menu_name = 'navigation') {
  static $menu_output = array();

  if (!isset($menu_output[$menu_name])) {
    $tree_all_data = menu_tree_all_data($menu_name);
    $tree = menu_find_active_trail($tree_all_data);
    $menu_output[$menu_name] = menu_tree_output($tree);
  }
  return $menu_output[$menu_name];
}

/**
 * Wrapper function
 */
function menu_find_active_trail(&$menu_tree) {
  $item = menu_get_item();
  _menu_find_active_trail($menu_tree, $item);
  return $menu_tree;
}
/**
 * Recursive function to find the active menu and the active trail in the given tree.
 */
function _menu_find_active_trail(&$menu_tree, $item) {
  $level_is_expanded = FALSE;
  foreach($menu_tree as &$menu_item) {
    $link = &$menu_item['link'];
    if ($link['href']==$item['href']) { // Found the exact location in the tree
      $link['active'] = TRUE;
      $link['in_active_trail'] = TRUE;
      return true;
    } else {
      if ($link['has_children']) {
        $result = _menu_find_active_trail($menu_item['below'], $item);
        $link['in_active_trail'] = $result;
        if ($result) $level_is_expanded = TRUE;
      }
    }
  }
  return $level_is_expanded;
}
