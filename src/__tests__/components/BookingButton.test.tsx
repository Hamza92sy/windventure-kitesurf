import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'

// Test simple pour vérifier que les tests fonctionnent
describe('BookingButton', () => {
  it('should render booking button', () => {
    render(<button>Book Now</button>)
    expect(screen.getByText('Book Now')).toBeInTheDocument()
  })
}) 