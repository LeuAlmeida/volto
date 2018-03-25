/**
 * SchemaWidget component.
 * @module components/manage/Widgets/SchemaWidget
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findIndex, keys, map, omit, slice } from 'lodash';
import move from 'lodash-move';
import { Confirm, Form, Grid, Icon, Menu, Segment } from 'semantic-ui-react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { Field, ModalForm, SchemaWidgetFieldset } from '../../../components';

const messages = defineMessages({
  addFieldset: {
    id: 'Add fieldset',
    defaultMessage: 'Add fieldset',
  },
  editFieldset: {
    id: 'Edit fieldset',
    defaultMessage: 'Edit fieldset',
  },
  default: {
    id: 'Default',
    defaultMessage: 'Default',
  },
  idTitle: {
    id: 'Short Name',
    defaultMessage: 'Short Name',
  },
  idDescription: {
    id: 'Used for programmatic access to the fieldset.',
    defaultMessage: 'Used for programmatic access to the fieldset.',
  },
  title: {
    id: 'Title',
    defaultMessage: 'Title',
  },
  delete: {
    id: 'Are you sure you want to delete this fieldset including all fields?',
    defaultMessage:
      'Are you sure you want to delete this fieldset including all fields?',
  },
});

@DragDropContext(HTML5Backend)
@injectIntl
@connect((state, props) => ({
  value: JSON.parse(props.value),
}))
/**
 * SchemaWidget component class.
 * @class SchemaWidget
 * @extends Component
 */
export default class SchemaWidget extends Component {
  /**
   * Property types.
   * @property {Object} propTypes Property types.
   * @static
   */
  static propTypes = {
    /**
     * Id of the field
     */
    id: PropTypes.string.isRequired,
    /**
     * Title of the field
     */
    required: PropTypes.bool,
    /**
     * Value of the field
     */
    value: PropTypes.object,
    /**
     * List of error messages
     */
    error: PropTypes.arrayOf(PropTypes.string),
    /**
     * On change handler
     */
    onChange: PropTypes.func.isRequired,
    /**
     * Intl object
     */
    intl: intlShape.isRequired,
  };

  /**
   * Default properties
   * @property {Object} defaultProps Default properties.
   * @static
   */
  static defaultProps = {
    required: false,
    value: {},
    error: [],
  };

  /**
   * Constructor
   * @method constructor
   * @param {Object} props Component properties
   * @constructs WysiwygEditor
   */
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onAddFieldset = this.onAddFieldset.bind(this);
    this.onEditFieldset = this.onEditFieldset.bind(this);
    this.onDeleteFieldset = this.onDeleteFieldset.bind(this);
    this.onShowAddFieldset = this.onShowAddFieldset.bind(this);
    this.onShowEditFieldset = this.onShowEditFieldset.bind(this);
    this.onShowDeleteFieldset = this.onShowDeleteFieldset.bind(this);
    this.onSetCurrentFieldset = this.onSetCurrentFieldset.bind(this);
    this.onOrderFieldset = this.onOrderFieldset.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.state = {
      addFieldset: null,
      editFieldset: null,
      deleteFieldset: null,
      currentFieldset: 0,
    };
  }

  /**
   * Add fieldset handler
   * @method onAddFieldset
   * @param {Object} values Form values
   * @returns {undefined}
   */
  onAddFieldset(values) {
    this.onChange({
      ...this.props.value,
      fieldsets: [...this.props.value.fieldsets, values],
    });
    this.onCancel();
  }

  /**
   * Edit fieldset handler
   * @method onEditFieldset
   * @param {Object} values Form values
   * @returns {undefined}
   */
  onEditFieldset(values) {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.editFieldset),
        values,
        ...slice(this.props.value.fieldsets, this.state.editFieldset + 1),
      ],
    });
    this.onCancel();
  }

  /**
   * Delete fieldset handler
   * @method onDeleteFieldset
   * @returns {undefined}
   */
  onDeleteFieldset() {
    this.onChange({
      ...this.props.value,
      fieldsets: [
        ...slice(this.props.value.fieldsets, 0, this.state.deleteFieldset),
        ...slice(this.props.value.fieldsets, this.state.deleteFieldset + 1),
      ],
      properties: omit(
        this.props.value.properties,
        this.props.value.fieldsets[this.state.deleteFieldset].fields,
      ),
    });
    this.onCancel();
  }

  /**
   * Change handler
   * @method onChange
   * @param {Object} value New schema
   * @returns {undefined}
   */
  onChange(value) {
    this.props.onChange(this.props.id, JSON.stringify(value));
  }

  /**
   * Cancel handler
   * @method onCancel
   * @returns {undefined}
   */
  onCancel() {
    this.setState({
      addFieldset: null,
      editFieldset: null,
      deleteFieldset: null,
    });
  }

  /**
   * Show add fieldset handler
   * @method onShowAddFieldset
   * @returns {undefined}
   */
  onShowAddFieldset() {
    this.setState({
      addFieldset: true,
    });
  }

  /**
   * Show edit fieldset handler
   * @method onShowEditFieldset
   * @param {Number} index Index of fieldset
   * @returns {undefined}
   */
  onShowEditFieldset(index) {
    this.setState({
      editFieldset: index,
    });
  }

  /**
   * Show delete fieldset handler
   * @method onShowDeleteFieldset
   * @param {Number} index Index of fieldset
   * @param {Object} event Event object
   * @returns {undefined}
   */
  onShowDeleteFieldset(index) {
    this.setState({
      deleteFieldset: index,
    });
  }

  /**
   * Set current fieldset handler
   * @method onSetCurrentFieldset
   * @param {Number} index Index of fieldset
   * @returns {undefined}
   */
  onSetCurrentFieldset(index) {
    this.setState({
      currentFieldset: index,
    });
  }

  /**
   * On order fieldset
   * @method onOrderFieldset
   * @param {number} index Index
   * @param {number} delta Delta
   * @returns {undefined}
   */
  onOrderFieldset(index, delta) {
    const value = {
      ...this.props.value,
      fieldsets: move(this.props.value.fieldsets, index, index + delta),
    };
    this.setState({
      currentFieldset: findIndex(value.fieldsets, {
        id: this.props.value.fieldsets[this.state.currentFieldset].id,
      }),
    });
    this.onChange(value);
  }

  /**
   * Render method.
   * @method render
   * @returns {string} Markup for the component.
   */
  render() {
    const { value, error } = this.props;

    console.log(value);

    return (
      <Form method="post" error={keys(error).length > 0}>
        <Segment.Group raised>
          <div className="ui pointing secondary attached tabular menu">
            {map(value.fieldsets, (item, index) => (
              <SchemaWidgetFieldset
                key={item.id}
                title={item.title}
                order={index}
                active={index === this.state.currentFieldset}
                onClick={this.onSetCurrentFieldset}
                onShowEditFieldset={this.onShowEditFieldset}
                onShowDeleteFieldset={this.onShowDeleteFieldset}
                onOrderFieldset={this.onOrderFieldset}
              />
            ))}
            <Menu.Item key="add">
              <a onClick={this.onShowAddFieldset}>
                <Icon name="plus" size="large" />
              </a>
            </Menu.Item>
          </div>
          {map(value.fieldsets[this.state.currentFieldset].fields, field => (
            <Field
              {...value.properties[field]}
              id={field}
              required={value.required.indexOf(field) !== -1}
              onChangeSchema={() => true}
              key={field}
            />
          ))}
          <Form.Field inline>
            <Grid>
              <Grid.Row stretched>
                <Grid.Column width="12">
                  <div className="wrapper">
                    <label>Add new field</label>
                  </div>
                  <div className="toolbar">
                    <Icon name="plus" color="blue" size="large" />
                  </div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Form.Field>,
        </Segment.Group>
        {this.state.addFieldset !== null && (
          <ModalForm
            onSubmit={this.onAddFieldset}
            onCancel={this.onCancel}
            title={this.props.intl.formatMessage(messages.addFieldset)}
            formData={{
              id: '',
              title: '',
            }}
            schema={{
              fieldsets: [
                {
                  id: 'default',
                  title: this.props.intl.formatMessage(messages.default),
                  fields: ['title', 'id'],
                },
              ],
              properties: {
                id: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.idTitle),
                  description: this.props.intl.formatMessage(
                    messages.idDescription,
                  ),
                },
                title: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.title),
                },
              },
              required: ['id', 'title'],
            }}
          />
        )}
        {this.state.editFieldset !== null && (
          <ModalForm
            onSubmit={this.onEditFieldset}
            onCancel={this.onCancel}
            title={this.props.intl.formatMessage(messages.editFieldset)}
            formData={{
              id: this.props.value.fieldsets[this.state.editFieldset].id,
              title: this.props.value.fieldsets[this.state.editFieldset].title,
            }}
            schema={{
              fieldsets: [
                {
                  id: 'default',
                  title: this.props.intl.formatMessage(messages.default),
                  fields: ['title', 'id'],
                },
              ],
              properties: {
                id: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.idTitle),
                  description: this.props.intl.formatMessage(
                    messages.idDescription,
                  ),
                },
                title: {
                  type: 'string',
                  title: this.props.intl.formatMessage(messages.title),
                },
              },
              required: ['id', 'title'],
            }}
          />
        )}
        {this.state.deleteFieldset !== null && (
          <Confirm
            open
            content={this.props.intl.formatMessage(messages.delete)}
            onCancel={this.onCancel}
            onConfirm={this.onDeleteFieldset}
          />
        )}
      </Form>
    );
  }
}
