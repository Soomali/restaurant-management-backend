import { MockUpdateAppointmentConfigDTO } from "src/company/schema/company.mock-data";
import { objectToInnerObjectRepresentation } from "./object_to_inner_object_representation.util";

describe('Utils', () => {


  it('Should correctly represent object as inner object', () => {

    const representation = objectToInnerObjectRepresentation('appointment_config', {
      can_customer_add_note: false
    });

    expect(representation['appointment_config.can_customer_add_note']).toBe(false);
    expect(Object.keys(representation).length).toBe(1);

  });
});