import '@testing-library/jest-dom'
import * as React from 'react'
import {render, fireEvent} from '@testing-library/react'
import BookSearch from './BookSearch';
import * as userUtils from "./book-search.service";
const mockGetUsers = jest.spyOn(userUtils, 'getBooksByType');
const users = {items:[{volumeInfo:{
    title:'test',
    authors:'',
    publisher:'',
    publishedDate:'',
    description:'',
    imageLinks:{thumbnail:'/'}
}}]};
mockGetUsers.mockResolvedValue(users);
it('should call updateBookType method ', async() => {
    const {getByTestId, getByText} = await render(<BookSearch />);
    fireEvent.click(getByTestId('empty-booktype'));
    fireEvent.change(getByTestId('add-search'),{target:{value:'javascript'}});
    const serachInput = getByTestId('add-search') as HTMLInputElement;
    fireEvent.submit(getByTestId('form'));
    expect(serachInput.value).toBe('javascript');
});
