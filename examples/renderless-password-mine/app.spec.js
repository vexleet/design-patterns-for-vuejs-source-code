import {fireEvent, render} from "@testing-library/vue";
import App from "../renderless-password-example/App.vue";

describe.skip('Renderless password app component', function () {
  let renderlessPasswordAppComponent;

  beforeEach(function () {
    renderlessPasswordAppComponent = render(App)
  })

  describe('button validation', function () {
    it('should be disabled if password is empty', function () {
      expect(renderlessPasswordAppComponent.getByRole('button')).toBeDisabled()
    })

    it('should be disabled if password is less than 5 characters', async function () {
      const passwordInput = renderlessPasswordAppComponent.getByLabelText('Password')
      const confirmationInput = renderlessPasswordAppComponent.getByLabelText('Confirmation')

      await fireEvent.update(passwordInput, 'pass')
      await fireEvent.update(confirmationInput, 'pass')

      expect(renderlessPasswordAppComponent.getByRole('button')).toBeDisabled()
    })
  });
});
