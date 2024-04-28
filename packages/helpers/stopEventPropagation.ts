/**
 * Stops the propagation of a SyntheticEvent.
 *
 * @param event The SyntheticEvent to stop propagation for.
 * @returns void.
 */
const stopEventPropagation = (event: any) => event.stopPropagation();

export default stopEventPropagation;
