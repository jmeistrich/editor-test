import { StatusBar } from 'expo-status-bar';
import { useRef, useState } from 'react';
import {
  Linking,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  EnrichedTextInput,
  type EnrichedTextInputInstance,
  type OnChangeStateEvent,
} from 'react-native-enriched';
import { EnrichedMarkdownText } from 'react-native-enriched-markdown';

type ToolbarButtonProps = {
  label: string;
  active?: boolean;
  disabled?: boolean;
  onPress: () => void;
};

function ToolbarButton({
  label,
  active = false,
  disabled = false,
  onPress,
}: ToolbarButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.toolbarButton,
        active && styles.toolbarButtonActive,
        disabled && styles.toolbarButtonDisabled,
      ]}
    >
      <Text style={[styles.toolbarButtonText, active && styles.toolbarButtonTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function App() {
  const { width } = useWindowDimensions();
  const isTwoPane = width >= 900;
  const editorRef = useRef<EnrichedTextInputInstance>(null);
  const [styleState, setStyleState] = useState<OnChangeStateEvent | null>(null);
  const [htmlValue, setHtmlValue] = useState('');

  const previewMarkdown = `# Markdown Preview

This pane renders a markdown document with \`react-native-enriched-markdown\`.

## Formatting

- **Bold text**
- *Italic text*
- ~~Strikethrough~~
- [React Native](https://reactnative.dev)

> This is a blockquote rendered natively.

\`\`\`ts
const message = "Hello from markdown preview";
console.log(message);
\`\`\`
`;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>react-native-enriched editor</Text>
        <Text style={styles.subtitle}>
          Left: rich text editor. Right: markdown document rendered with enriched-markdown.
        </Text>

        <View
          style={[
            styles.workspace,
            isTwoPane ? styles.workspaceRow : styles.workspaceColumn,
          ]}
        >
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Editor</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.toolbarRow}
            >
              <ToolbarButton
                label="B"
                active={styleState?.bold.isActive}
                disabled={styleState?.bold.isBlocking}
                onPress={() => editorRef.current?.toggleBold()}
              />
              <ToolbarButton
                label="I"
                active={styleState?.italic.isActive}
                disabled={styleState?.italic.isBlocking}
                onPress={() => editorRef.current?.toggleItalic()}
              />
              <ToolbarButton
                label="U"
                active={styleState?.underline.isActive}
                disabled={styleState?.underline.isBlocking}
                onPress={() => editorRef.current?.toggleUnderline()}
              />
              <ToolbarButton
                label="H1"
                active={styleState?.h1.isActive}
                disabled={styleState?.h1.isBlocking}
                onPress={() => editorRef.current?.toggleH1()}
              />
              <ToolbarButton
                label="Quote"
                active={styleState?.blockQuote.isActive}
                disabled={styleState?.blockQuote.isBlocking}
                onPress={() => editorRef.current?.toggleBlockQuote()}
              />
              <ToolbarButton
                label="• List"
                active={styleState?.unorderedList.isActive}
                disabled={styleState?.unorderedList.isBlocking}
                onPress={() => editorRef.current?.toggleUnorderedList()}
              />
            </ScrollView>

            <View style={styles.editorCard}>
              <EnrichedTextInput
                ref={editorRef}
                style={styles.editor}
                placeholder="Write rich text here..."
                onChangeState={(event) => setStyleState(event.nativeEvent)}
                onChangeHtml={(event) => setHtmlValue(event.nativeEvent.value)}
              />
            </View>

            <View style={styles.outputCard}>
              <Text style={styles.outputTitle}>HTML Output</Text>
              <Text style={styles.outputText}>
                {htmlValue || 'Start typing to see generated HTML...'}
              </Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Markdown Preview</Text>
            <View style={styles.previewCard}>
              <ScrollView contentContainerStyle={styles.previewContent}>
                <EnrichedMarkdownText
                  markdown={previewMarkdown}
                  onLinkPress={({ url }) => {
                    void Linking.openURL(url);
                  }}
                />
              </ScrollView>
            </View>
          </View>
        </View>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    color: '#374151',
    fontSize: 14,
  },
  workspace: {
    flex: 1,
    gap: 12,
  },
  workspaceRow: {
    flexDirection: 'row',
  },
  workspaceColumn: {
    flexDirection: 'column',
  },
  panel: {
    flex: 1,
    gap: 10,
    minHeight: 0,
  },
  panelTitle: {
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#6b7280',
    fontWeight: '700',
  },
  toolbarRow: {
    gap: 8,
    paddingVertical: 6,
    paddingRight: 12,
  },
  toolbarButton: {
    height: 36,
    minWidth: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  toolbarButtonActive: {
    backgroundColor: '#0f172a',
    borderColor: '#0f172a',
  },
  toolbarButtonDisabled: {
    opacity: 0.45,
  },
  toolbarButtonText: {
    color: '#111827',
    fontSize: 14,
    fontWeight: '600',
  },
  toolbarButtonTextActive: {
    color: '#ffffff',
  },
  editorCard: {
    flex: 1,
    minHeight: 220,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    padding: 10,
  },
  editor: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    lineHeight: 24,
  },
  outputCard: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    padding: 12,
    gap: 6,
    maxHeight: 190,
  },
  outputTitle: {
    fontSize: 13,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    color: '#6b7280',
    fontWeight: '700',
  },
  outputText: {
    fontFamily: 'Menlo',
    color: '#1f2937',
    fontSize: 12,
    lineHeight: 17,
  },
  previewCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#ffffff',
    padding: 12,
    minHeight: 220,
  },
  previewContent: {
    paddingBottom: 16,
  },
});
