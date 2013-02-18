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

  return system_settings_form($form);
}
