<?php

/**
 * @file
 * Contains the configuration interface for Ding availability.
 */

function ding_availability_admin_settings_form($form, &$form_state) {
  $form = array();

  $form['settings'] = array(
    '#type' => 'fieldset',
    '#title' => t('Ding availability settings'),
  );

  $form['settings']['ding_availability_only_available'] = array(
    '#type' => 'checkbox',
    '#title' => t('Only show holdings for branches where the material is available.'),
    '#default_value' => variable_get('ding_availability_only_available', TRUE),
  );
  // Get available types.
  $types = array_flip(variable_get('ting_well_types', array()));
  $form['settings']['ding_availability_holdings_types'] = array(
    '#type' => 'checkboxes',
    '#title' => t('Types'),
    '#options' => drupal_map_assoc(array_keys(variable_get('ting_well_types', array()))),
    '#default_value' => variable_get('ding_availability_holdings_types', _ding_availability_holdings_default_types()),
  );
  
  return system_settings_form($form);
}
