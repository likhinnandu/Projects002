import { Component, ChangeDetectorRef } from '@angular/core';
import { JsonFormsModule } from '@jsonforms/angular';
import { angularMaterialRenderers } from '@jsonforms/angular-material';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, JsonFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  renderers = [...angularMaterialRenderers];
  showFeedbackForm = false;
  // Main form data
  data = {
    name: '',
    email: '',
    age: '',
    gender: '',
    phoneNumber: '',
    country: '',
    state: '',
    address: { city: '', street: '' },
    subscribe: false,
  };
  // Feedback form data
  feedbackData = {
    rating: '',
    comments: '',
  };
  // Main form schema
  schema: any = {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      age: { type: 'integer', minimum: 0, maximum: 120 },
      gender: { type: 'string', enum: ['Male', 'Female', 'Other'] },
      phoneNumber: { type: 'string', pattern: '^\\d{10}$' },
      country: { type: 'string', enum: ['USA', 'India', 'Germany'] },
      state: { type: 'string', enum: [] },
      address: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          street: { type: 'string' },
        },
        required: ['city', 'street'],
      },
      subscribe: { type: 'boolean', title: 'Agree to terms and conditions!' },
    },
    required: ['name', 'email', 'age', 'gender', 'phoneNumber', 'country', 'state', 'address', 'subscribe'],
  };
  // UI Schema
  uischema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/name' },
      { type: 'Control', scope: '#/properties/email' },
      { type: 'Control', scope: '#/properties/age' },
      { type: 'Control', scope: '#/properties/gender' },
      { type: 'Control', scope: '#/properties/phoneNumber' },
      { type: 'Control', scope: '#/properties/country' },
      { type: 'Control', scope: '#/properties/state' },
      {
        type: 'Group',
        label: 'Address',
        elements: [
          { type: 'Control', scope: '#/properties/address/properties/city' },
          { type: 'Control', scope: '#/properties/address/properties/street' },
        ],
      },
      { type: 'Control', scope: '#/properties/subscribe' },
    ],
  };
  feedbackSchema = {
    type: 'object',
    properties: {
      rating: {
        type: 'string',
        enum: ['Excellent', 'Good', 'Average', 'Poor'],
        title: 'How was your experience?',
      },
      comments: { type: 'string', title: 'Any comments?' },
    },
    required: ['rating'],
  };
  feedbackUiSchema = {
    type: 'VerticalLayout',
    elements: [
      { type: 'Control', scope: '#/properties/rating' },
      { type: 'Control', scope: '#/properties/comments' },
    ],
  };
  constructor(private cdRef: ChangeDetectorRef) {}
  onChange(event: any) {
    this.data = event.data;
    const selectedCountry = this.data.country;
    const stateMap: { [key: string]: string[] } = {
      USA: ['New York', 'California', 'Texas'],
      India: ['Telangana', 'Maharashtra', 'Karnataka'],
      Germany: ['Bavaria', 'Berlin', 'Hesse'],
    };
    if (selectedCountry && stateMap[selectedCountry]) {
      (this.schema.properties.state as any).enum = stateMap[selectedCountry];
    } else {
      (this.schema.properties.state as any).enum = [];
    }
    this.schema = { ...this.schema }; // Force re-render
  }
  onSubmit() {
    console.log('Main form submitted:', this.data);
    this.showFeedbackForm = true;
    this.cdRef.detectChanges();
    // Reset feedback form data and schemas
    this.feedbackData = { rating: '', comments: '' };
    this.feedbackSchema = { ...this.feedbackSchema };
    this.feedbackUiSchema = { ...this.feedbackUiSchema };
  }
  onFeedbackChange(event: any) {
    this.feedbackData = event.data;
  }
  onFeedbackSubmit() {
    console.log('Feedback submitted:', this.feedbackData);
    alert('🎉 Thank you for your feedback!');
    this.showFeedbackForm = false;
  }
}
