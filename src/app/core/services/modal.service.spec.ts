import { TestBed } from '@angular/core/testing';
import { ModalService } from './modal.service';

describe('ModalService (Task 4 — Service Testing)', () => {
  let service: ModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalService);
  });

  it('activeModal() is null when the service is first created', () => {
    expect(service.activeModal()).toBeNull();
  });

  it('payload() is null when the service is first created', () => {
    expect(service.payload()).toBeNull();
  });

  it('open() sets activeModal to the given modal type', () => {
    service.open('add-board');
    expect(service.activeModal()).toBe('add-board');
  });

  it('open() sets the payload when one is provided', () => {
    const task = { id: 't1', title: 'My Task' };
    service.open('view-task', task);
    expect(service.payload()).toEqual(task);
  });

  it('open() leaves payload as null when no payload is given', () => {
    service.open('add-board');
    expect(service.payload()).toBeNull();
  });

  it('close() resets activeModal to null', () => {
    service.open('edit-board');
    service.close();
    expect(service.activeModal()).toBeNull();
  });

  it('close() resets payload to null', () => {
    service.open('view-task', { id: 't1' });
    service.close();
    expect(service.payload()).toBeNull();
  });

  it('open() can be called multiple times, always updating to the latest modal', () => {
    service.open('add-board');
    service.open('delete-board');
    expect(service.activeModal()).toBe('delete-board');
  });
});
